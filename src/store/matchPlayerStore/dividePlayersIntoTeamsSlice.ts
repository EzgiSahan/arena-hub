import { createAsyncThunk } from "@reduxjs/toolkit";

interface FetchPlayerRatingsParams {
    matchId: string; // or number
}

export const dividePlayersIntoTeams = createAsyncThunk(
    "matchPlayers/divideIntoTeams",
    async ({ matchId }: FetchPlayerRatingsParams) => {
      console.log(matchId);
      try {
        const matchPlayersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/matchPlayers?match_id=${matchId}`);
        const matchPlayersData = await matchPlayersResponse.json();
        console.log("matchPlayers:", matchPlayersData);
  
        const matchPlayers = matchPlayersData.users;
  
        // Oyuncuların detaylarını ve average_rating'lerini al
        const playerDetails = await Promise.all(
          matchPlayers.map(async (player) => {
            const userResponse = await fetch(`/api/users/${player.user_id}`);
            const data = await userResponse.json();
            return { ...player, average_rating: data.average_rating };
          })
        );
  
        // Oyuncuları average_rating'e göre sırala (büyükten küçüğe)
        playerDetails.sort((a, b) => b.average_rating - a.average_rating);
        console.log(playerDetails.sort((a, b) => b.average_rating - a.average_rating));
  
        // Takım pozisyonları
        const teamPositions = {
          Kaleci: 1,
          Stoper: 2,
          Bek: 2,
          "Ön Libero": 1,
          "Orta Saha": 2,
          Forvet: 2,
          Santrofor: 1,
        };
  
        const team1 = [];
        const team2 = [];
        const teams = [team1, team2];
        let currentTeam = 0;
  
        // Pozisyona göre oyuncuları dağıt
        for (const position in teamPositions) {
          const playersInPosition = playerDetails.filter((p) => p.position === position);
  
          // Pozisyona yeterli oyuncu varsa takımlara dağıt
          for (let i = 0; i < teamPositions[position]; i++) {
            if (playersInPosition[i]) {
              teams[currentTeam].push(playersInPosition[i]);
              playersInPosition[i].team = currentTeam + 1;
              currentTeam = 1 - currentTeam; // Takımı değiştir
            }
          }
        }
  
        // Eğer takımların boyutları eşit değilse, kalan oyuncuları dengele
        const remainingPlayers = playerDetails.filter((p) => !p.team);
        for (const player of remainingPlayers) {
          teams[currentTeam].push(player);
          player.team = currentTeam + 1;
          currentTeam = 1 - currentTeam; // Takımı değiştir
        }
  
        // Takım bilgilerini API'ye kaydet
        await Promise.all(
          playerDetails.map((player) =>
            fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/matchPlayers/${player._id}`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ team: player.team }),
            })
          )
        );
  
        console.log("Team 1:", team1);
        console.log("Team 2:", team2);
  
        return { team1, team2 };
      } catch (error) {
        console.error("Takımlara ayırma sırasında hata oluştu:", error);
        throw error;
      }
    }
  );
  