import { useRouter } from "next/router";
import { client, getProfileById, getPublications } from "../../api";
import { useEffect, useState } from "react";
import Image from "next/image";
import ABI from "../../abi.json";
import { ethers } from "ethers";

const CONTRACT_ADDRESS = "0xDb46d1Dc155634FbC732f92E853b10B288AD5a1d";

export default function Profile() {
  const router = useRouter();
  const id = router.query.id;
  const [profile, setProfile] = useState(null);
  const [pubs, setPubs] = useState([]);

  useEffect(() => {
    if (id) {
      fetchProfile();
      fetchPublications();
    }
  }, [id]);

  const fetchProfile = async () => {
    try {
      const { data } = await client.query(getProfileById, { id }).toPromise();
      console.log({ data });
      setProfile(data.profiles.items[0]);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchPublications = async () => {
    try {
      const { data } = await client.query(getPublications, { id }).toPromise();
      console.log({ data });
      setPubs(data.publications.items);
    } catch (error) {
      console.log(error);
    }
  };

  const connect = async () => {
    const accounts = await window.ethereum.request({
      method: "eth_requestAccounts",
    });
    console.log({ accounts });
  };

  const followUser = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

    try {
      const tx = await contract.follow([id], [0x0]);
      console.log({ tx });
      await tx.wait();
      console.log("Transaction complete!");
    } catch (error) {
      console.log({ error });
    }
  };

  if (!profile) {
    return null;
  }

  return (
    <div>
      {profile.coverPicture ? (
        <Image
          src={profile.coverPicture.original.url}
          width={"200px"}
          height={"200px"}
          alt="coverPicture"
        />
      ) : (
        <div
          style={{ width: "200px", height: "200px", backgroundColor: "black" }}
        />
      )}

      <div>
        <button onClick={connect}>Connect Wallet</button>
      </div>

      <div>
        <h4>{profile.handle}</h4>
        <p>{profile.bio}</p>
        <p>Followers: {profile.stats.totalFollowers}</p>
        <p>Following: {profile.stats.totalFollowing}</p>
        <button onClick={followUser}>Follow</button>
      </div>

      <div>
        {pubs.map((pub, index) => (
          <div
            key={index}
            style={{ padding: "20px", borderTop: "1px solid #ededed" }}
          >
            <p>{pub.metadata.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
