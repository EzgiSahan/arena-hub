import MatchPlayers from "@/models/matchPlayers";
import Users from "@/models/users";

const distributePlayersToTeams = async (matchId) => {
  try {
    const players = await MatchPlayers.find({ match_id: matchId }).lean();

    if (!players.length) {
      throw new Error("Maça ait oyuncu bulunamadı.");
    }

    const userIds = players.map((player) => player.user_id);
    const users = await Users.find({ _id: { $in: userIds } }).lean();

    const playersWithRatings = players.map((player) => {
      const user = users.find((u) => u._id.toString() === player.user_id.toString());
      return { ...player, average_rating: user?.average_rating || 0 };
    });

    const groupedPlayers = {};
    ["Kaleci", "Stoper", "Bek", "Ön Libero", "Orta Saha", "Forvet", "Santrofor"].forEach((position) => {
      groupedPlayers[position] = playersWithRatings
        .filter((player) => player.position === position)
        .sort((a, b) => b.average_rating - a.average_rating); 
    });

    const team1 = [];
    const team2 = [];

    for (const position in groupedPlayers) {
      const playersInPosition = groupedPlayers[position];

      playersInPosition.forEach((player, index) => {
        if (index % 2 === 0) {
          team1.push(player);
        } else {
          team2.push(player);
        }
      });
    }

    const bulkOperations = [...team1.map((player) => ({
      updateOne: {
        filter: { _id: player._id },
        update: { team: 1 },
      },
    })), ...team2.map((player) => ({
      updateOne: {
        filter: { _id: player._id },
        update: { team: 2 },
      },
    }))];

    await MatchPlayers.bulkWrite(bulkOperations);

    return { success: true, message: "Oyuncular başarıyla takımlara ayrıldı." };
  } catch (error) {
    console.error("Hata oluştu:", error);
    return { success: false, message: error.message };
  }
};

export default distributePlayersToTeams;
