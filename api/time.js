export default async function handler(req, res) {

    try {

        const response = await fetch(
            "https://gateway.timeapi.world/timezone/Africa/Cairo"
        );

        const data = await response.json();

        res.status(200).json(data);

    } catch (e) {

        res.status(500).json({
            error: true
        });

    }

}
