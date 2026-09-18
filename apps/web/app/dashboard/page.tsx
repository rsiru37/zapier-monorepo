"use client"
import { Appbar } from "@/components/Appbar";
import { DarkButton } from "@/components/buttons/DarkButton";
import axios from "axios";
import { useEffect, useState } from "react";
import { LinkButton } from "@/components/buttons/LinkButton";
import { useRouter } from "next/navigation";

interface Zap {
    "id": string,
    "trigger_id": string,
    "user_id": number,
    "Action": {
        "id": string,
        "action_name_id": string,
        "zap_id": string,
        "sortingOrder": number,
        "Available_Actions": {
            "id": string,
            "image": string,
            "name": string
        }
    }[],
    "Trigger": {
        "id": string,
        "trigger_id": string,
        "Available_Triggers": {
            "id": string,
            "trigger_name": string
        }
    }
}

function useZaps() {
    const [loading, setLoading] = useState(true);
    const [zaps, setZaps] = useState<Zap[]>([]);

    useEffect(() => {
        async function fetchZaps() {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/zap`, {
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });
        setZaps(response.data.zaps);
        setLoading(false);
        console.log("RESPONSE", response.data);
    }
    fetchZaps();
    
    console.log("ZAPS", zaps);
}, []);

    return {
        loading, zaps    
}
}

export default function() {
    const { loading, zaps } = useZaps();
    const router = useRouter();
    
    return <div>
        <div className="flex justify-center pt-8">
            <div className="max-w-screen-lg	 w-full">
                <div className="flex justify-between pr-8 ">
                    <div className="text-2xl font-bold">
                        My Zaps
                    </div>
                    <DarkButton onClick={() => {
                        router.push("/zap/create");
                    }}>Create</DarkButton>
                </div>
            </div>
        </div>
        {loading ? "Loading..." : <div className="flex justify-center"> <ZapCard zaps={zaps} /></div>}
    </div>
}

function ZapCard({ zaps }: { zaps: Zap[] }) {
  const router = useRouter();

  return (
    <div className="p-8 max-w-screen-lg w-full">
      <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {zaps.map((z) => (
          <div
            key={z.id}
            className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-shadow duration-300"
          >

            <h4 className="text-xl font-semibold mb-2">
              {z.Trigger.Available_Triggers.trigger_name}
            </h4>

            <h2 className="text-xl font-semibold mb-2">
              {z.Action.map((action) => (
                <span key={action.sortingOrder}>{action.sortingOrder}. {action.Available_Actions.name}<br></br>
                </span>
              ))}
            </h2>
            {/* {z.Action.map((action, index) => (
    <li key={`${action.id}-${index}`}>
      <strong>{action.Available_Actions.name}</strong>
    </li>
  ))} */}

            {/* ID */}
            <div className="text-sm text-gray-500 mb-2">
              <span className="font-medium">ZAP ID:</span> {z.id}
            </div>

            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-1">
                Webhook URL
              </p>

              <div className="bg-gray-100 rounded-md p-2 text-xs break-all text-gray-600">
                {`${process.env.NEXT_PUBLIC_HOOKS_URL}/${z.user_id}/${z.id}`}
              </div>
            </div>

            {/* Button */}
            <button
              onClick={() => router.push(`/zap/${z.id}`)}
              className="w-full bg-black text-white py-2 rounded-lg hover:bg-gray-800 transition"
            >
              View Zap
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}