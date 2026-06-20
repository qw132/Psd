export default async function handler(req, res) {

  const id = req.query.id;

  try {

    const response = await fetch(
      `https://api.football-data.org/v4/matches/${id}`,
      {
        headers: {
          "X-Auth-Token": "4a4ee4db99b54437a21191453e1cc91e"
        }
      }
    );

    const data = await response.json();

    res.status(200).json(data);

  } catch (error) {

    res.status(500).json({
      error: "Failed to load match"
    });

  }

      }
