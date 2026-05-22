export default async function handler(req, res) {
  try {
    const { path } = req.query;

    const target =
      `http://43.136.115.90:9000/blog-images/${path}`;

    const response = await fetch(target);

    if (!response.ok) {
      return res.status(response.status).send('Image not found');
    }

    res.setHeader(
      'Content-Type',
      response.headers.get('content-type')
    );

    const arrayBuffer = await response.arrayBuffer();

    res.send(Buffer.from(arrayBuffer));
  } catch (err) {
    res.status(500).send(err.message);
  }
}
