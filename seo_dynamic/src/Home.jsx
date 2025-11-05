export default function Home({ data }) {
  return (
    <div>
      <p>Share any link:</p>
      <ul>
        <li><a href="/post/123">/post/123</a></li>
        <li><a href="/post/456">/post/456</a></li>
      </ul>
      <p>WhatsApp will show dynamic title + image!</p>
    </div>
  );
}