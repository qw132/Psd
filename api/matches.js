export default async function handler(req, res) {

  try {

    const response = await fetch(
      "https://api.football-data.org/v4/competitions/WC/matches",
      {
        headers: {
          "X-Auth-Token": "4a4ee4db99b54437a21191453e1cc91e"
        }
      }
    );

    if (!response.ok) {

      return res.status(response.status).json({
        error: "Football Data API Error"
      });

    }

    const data = await response.json();

    res.status(200).json(data);

  }
  catch (error) {

    console.error(error);

    res.status(500).json({
      error: "Failed to load matches"
    });

  }

      }
