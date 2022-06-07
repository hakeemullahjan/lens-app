import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { client, recommendProfiles } from "../api";

export default function Home() {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    try {
      const fetchData = async () => {
        const result = await client.query(recommendProfiles).toPromise();
        console.log({ result });
        setProfiles(result.data.recommendedProfiles);
        setLoading(false);
      };
      fetchData();
    } catch (error) {
      setError(error);
    }
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <div>
      {profiles.map((profile, index) => (
        <Link href={`/profile/${profile.id}`} key={index}>
          <a>
            <div>
              {profile.coverPicture ? (
                <Image
                  src={profile.coverPicture.original.url}
                  alt="coverPicture"
                  width="60px"
                  height="60px"
                />
              ) : (
                <div
                  style={{
                    width: "60px",
                    height: "60px",
                    backgroundColor: "black",
                  }}
                />
              )}
              <h4>{profile.handle}</h4>
              <p>{profile.bio}</p>
            </div>
          </a>
        </Link>
      ))}
    </div>
  );
}
