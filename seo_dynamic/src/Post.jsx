import { useParams } from 'react-router-dom';

export default function Post({ data }) {
  const { id } = useParams();
  return (
    <div>
      <h2>Post #{id}</h2>
      <p>{data.description}</p>
      <img src={data.image} alt="OG" style={{ maxWidth: 400 }} />
    </div>
  );
}