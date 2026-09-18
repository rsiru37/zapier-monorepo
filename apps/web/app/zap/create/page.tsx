"use client";
import { ZapCell } from "@/components/ZapCell";
import { useState, useEffect} from "react";
import { PrimaryButton } from "@/components/buttons/PrimaryButton";
import { LinkButton } from "@/components/buttons/LinkButton";
import { Input } from "@/components/Input";
import axios from "axios";
import { useRouter } from "next/navigation";

function useAvailableActionsAndTriggers() {
    const [availableActions, setAvailableActions] = useState<any[]>([]);
    const [availableTriggers, setAvailableTriggers] = useState<any[]>([]);

    useEffect(() => {
        // Fetch available actions and triggers from an API or other source
        const fetchAvailableActionsAndTriggers = async () => {
            const actions = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/action/available_actions`);
            const triggers = await axios.get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/trigger/available_triggers`);
            setAvailableActions(actions.data);

            setAvailableTriggers(triggers.data);
        };
        fetchAvailableActionsAndTriggers();
    }, []);

    return { availableActions, availableTriggers };
}


export default function CreateZap() {
    const router = useRouter();
    const [selectedTrigger, setSelectedTrigger] = useState<{id:string; trigger_name:string}>();
    const [selectedActions, setSelectedActions] = useState<{
        index: number;
        availableActionId: string;
        availableActionName: string;
        metadata: any;
    }[]>([]);
    const [selectedModalIndex, setSelectedModalIndex] = useState<null | number>(null);
    const { availableActions, availableTriggers } = useAvailableActionsAndTriggers();
    return(
        <div>
            <div className="flex justify-end bg-slate-200 p-4">
        <PrimaryButton onClick={async () => {
                if (!selectedTrigger?.id) {
                    return;
                }

                const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/zap`, {
                    "available_triggerid": selectedTrigger.id,
                    "triggermetada": {"msg":"test"},
                    "actions": selectedActions.map(a => ({
                        available_action_name_id: a.availableActionId,
                        action_metadata: a.metadata
                    }))
                }, {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`
                    }
                })
                router.push("/dashboard");
            }}>Publish</PrimaryButton>
            </div>
        <div>
        <div className="w-full min-h-screen bg-slate-200 flex flex-col justify-center">
            <div className="flex justify-center w-full">
                <ZapCell name={selectedTrigger?.trigger_name ? selectedTrigger.trigger_name : "Trigger"} onClick={() => {setSelectedModalIndex(1)}} index={1} />

            </div>
            <div className="w-full pt-2 pb-2">
                {selectedActions.map((action, index) => <div className="pt-2 flex justify-center"> <ZapCell name={action.availableActionName || "Action"} index={2 + index} onClick={() => {setSelectedModalIndex(action.index)}} /> </div>)}
            </div>
            <div className="flex justify-center">
                <div>
                    <PrimaryButton onClick={() => {
                        setSelectedActions(a => [...a, {
                            index: a.length + 2,
                            availableActionId: "",
                            availableActionName: "",
                            metadata: {},

                        }])
                    }}><div className="text-2xl">
                        +
                    </div></PrimaryButton>
                </div>
            </div>
        </div>
    </div>
         {selectedModalIndex && <Modal availableItems={selectedModalIndex === 1 ? availableTriggers.map((t: any) => ({id: t.id,name: t.trigger_name,image: t.image,})) : availableActions} 
              onSelect={(props: null | { name: string; id: string; metadata: any; }) => {
            if (props === null) {
                setSelectedModalIndex(null);
                return;
            }
            if (selectedModalIndex === 1) {
                console.log("Trigger selected:", props);
                setSelectedTrigger({
                    id: props.id,
                    trigger_name: props.name
                })
            } else {
                setSelectedActions(a => {
                    let newActions = [...a];
                    newActions[selectedModalIndex - 2] = {
                        index: selectedModalIndex,
                        availableActionId: props.id,
                        availableActionName: props.name,
                        metadata: props.metadata
                    }
                    return newActions
                })
                console.log("Action selected:", selectedActions);
            }
            setSelectedModalIndex(null);
        }} index={selectedModalIndex} />}
    </div>
    )
}

function Modal({ index, onSelect, availableItems }: { index: number, onSelect: (props: null | { name: string; id: string; metadata: any; }) => void, availableItems: {id: string, name: string, image: string;}[] }) {
    const [step, setStep] = useState(0);
    const [selectedAction, setSelectedAction] = useState<{id: string; name: string;}>();
    const [selectedTrigger, setSelectedTrigger] = useState<{id: string; trigger_name: string;}>();
    const isTrigger = index === 1;
    console.log("LOGS", availableItems);
    return <div className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-100 bg-opacity-70 flex">
        <div className="relative p-4 w-full max-w-2xl max-h-full">
            <div className="relative bg-white rounded-lg shadow ">
                <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
                    <div className="text-xl">
                        Select {index === 1 ? "Trigger" : "Action"}
                    </div>
                    <button onClick={() => {
                        onSelect(null);
                    }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal">
                        <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
                        </svg>
                        <span className="sr-only">Close modal</span>
                    </button>
                </div>
                <div className="p-4 md:p-5 space-y-4">
                    {step === 1 && selectedAction?.id === "email" && <EmailSelector setMetadata={(metadata) => {
                        onSelect({
                            ...selectedAction,
                            metadata
                        })
                    }} />}             
 
                    {(step === 2 && selectedAction?.id === "send-sol") && <SolanaSelector setMetadata={(metadata) => {
                        onSelect({
                            ...selectedAction,
                            metadata
                        })
                    }} />}

                    {step === 0 && <div>{availableItems.map(({id, name, image}) => {
                        console.log("AVAILABLE ITEMS", availableItems);
                            return <div onClick={() => {
                                if (isTrigger) {
                                    onSelect({
                                        id,
                                        name,
                                        metadata: {}
                                    })
                                } else {
                                    setStep(s => s + 1);
                                    setSelectedAction({
                                        id,
                                        name
                                    })
                                    console.log("Selected Action", selectedAction);
                                }
                            }} className="flex border p-4 cursor-pointer hover:bg-slate-100">
                                <img src={image} width={30} className="rounded-full" /> <div className="flex flex-col justify-center"> {name} </div>
                            </div>
                        })}</div>}                    
                </div>
            </div>
        </div>
    </div>
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// export default function() {
//     const router = useRouter();
//     const { availableActions, availableTriggers } = useAvailableActionsAndTriggers();
//     const [selectedTrigger, setSelectedTrigger] = useState<{
//         id: string;
//         name: string;
//     }>();

//     const [selectedActions, setSelectedActions] = useState<{
//         index: number;
//         availableActionId: string;
//         availableActionName: string;
//         metadata: any;
//     }[]>([]);
//     const [selectedModalIndex, setSelectedModalIndex] = useState<null | number>(null);

//     return <div>
//         <div className="flex justify-end bg-slate-200 p-4">
//             <PrimaryButton onClick={async () => {
//                 if (!selectedTrigger?.id) {
//                     return;
//                 }

//                 const response = await axios.post(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/v1/zap`, {
//                     "availableTriggerId": selectedTrigger.id,
//                     "triggerMetadata": {},
//                     "actions": selectedActions.map(a => ({
//                         availableActionId: a.availableActionId,
//                         actionMetadata: a.metadata
//                     }))
//                 }, {
//                     headers: {
//                         Authorization: `Bearer ${localStorage.getItem("token")}`
//                     }
//                 })
                
//                 router.push("/dashboard");

//             }}>Publish</PrimaryButton>
//         </div>
//         <div className="w-full min-h-screen bg-slate-200 flex flex-col justify-center">
//             <div className="flex justify-center w-full">
//                 <ZapCell onClick={() => {
//                     setSelectedModalIndex(1);
//                 }} name={selectedTrigger?.name ? selectedTrigger.name : "Trigger"} index={1} />
//             </div>
//             <div className="w-full pt-2 pb-2">
//                 {selectedActions.map((action, index) => <div className="pt-2 flex justify-center"> <ZapCell onClick={() => {
//                     setSelectedModalIndex(action.index);
//                 }} name={action.availableActionName ? action.availableActionName : "Action"} index={action.index} /> </div>)}
//             </div>
//             <div className="flex justify-center">
//                 <div>
//                     <PrimaryButton onClick={() => {
//                         setSelectedActions(a => [...a, {
//                             index: a.length + 2,
//                             availableActionId: "",
//                             availableActionName: "",
//                             metadata: {}
//                         }])
//                     }}><div className="text-2xl">
//                         +
//                     </div></PrimaryButton>
//                 </div>
//             </div>
//         </div>
//         {selectedModalIndex && <Modal availableItems={selectedModalIndex === 1 ? availableTriggers.map((t: any) => ({id: t.id,name: t.trigger_name,image: t.image,})) : availableActions} onSelect={(props: null | { name: string; id: string; metadata: any; }) => {
//             if (props === null) {
//                 setSelectedModalIndex(null);
//                 return;
//             }
//             if (selectedModalIndex === 1) {
//                 setSelectedTrigger({
//                     id: props.id,
//                     name: props.name
//                 })
//             } else {
//                 setSelectedActions(a => {
//                     let newActions = [...a];
//                     newActions[selectedModalIndex - 2] = {
//                         index: selectedModalIndex,
//                         availableActionId: props.id,
//                         availableActionName: props.name,
//                         metadata: props.metadata
//                     }
//                     return newActions
//                 })
//             }
//             setSelectedModalIndex(null);
//         }} index={selectedModalIndex} />}
//     </div>
// }

// function Modal({ index, onSelect, availableItems }: { index: number, onSelect: (props: null | { name: string; id: string; metadata: any; }) => void, availableItems: {id: string, name: string, image: string;}[] }) {
//     const [step, setStep] = useState(0);
//     const [selectedAction, setSelectedAction] = useState<{
//         id: string;
//         name: string;
//     }>();
//     const isTrigger = index === 1;

//     return <div className="fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full bg-slate-100 bg-opacity-70 flex">
//         <div className="relative p-4 w-full max-w-2xl max-h-full">
//             <div className="relative bg-white rounded-lg shadow ">
//                 <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t ">
//                     <div className="text-xl">
//                         Select {index === 1 ? "Trigger" : "Action"}
//                     </div>
//                     <button onClick={() => {
//                         onSelect(null);
//                     }} type="button" className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center" data-modal-hide="default-modal">
//                         <svg className="w-3 h-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
//                             <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/>
//                         </svg>
//                         <span className="sr-only">Close modal</span>
//                     </button>
//                 </div>
//                 <div className="p-4 md:p-5 space-y-4">
//                     {step === 1 && selectedAction?.name === "Send Email" && <EmailSelector setMetadata={(metadata) => {
//                         onSelect({
//                             ...selectedAction,
//                             metadata
//                         })
//                     }} />}

//                     {(step === 1 && selectedAction?.name === "Send Crypto") && <SolanaSelector setMetadata={(metadata) => {
//                         onSelect({
//                             ...selectedAction,
//                             metadata
//                         })
//                     }} />}

//                     {step === 0 && <div>{availableItems.map(({id, name, image}) => {
//                             return <div onClick={() => {
//                                 if (isTrigger) {
//                                     onSelect({
//                                         id,
//                                         name,
//                                         metadata: {}
//                                     })
//                                 } else {
//                                     setStep(s => s + 1);
//                                     setSelectedAction({
//                                         id,
//                                         name
//                                     })
//                                 }
//                             }} className="flex border p-4 cursor-pointer hover:bg-slate-100">
//                                 <img src={image} width={30} className="rounded-full" /> <div className="flex flex-col justify-center"> {name} </div>
//                             </div>
//                         })}</div>}                    
//                 </div>
//             </div>
//         </div>
//     </div>

// }

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function EmailSelector({setMetadata}: {setMetadata: (params: any) => void;}) {
    const [email, setEmail] = useState("");
    const [body, setBody] = useState("");

    return <div>
        <Input label={"To"} type={"text"} placeholder="To" onChange={(e) => setEmail(e.target.value)}></Input>
        <Input label={"Body"} type={"text"} placeholder="Body" onChange={(e) => setBody(e.target.value)}></Input>
        <div className="pt-2">
            <PrimaryButton onClick={() => {
                setMetadata({
                    email,
                    body
                })
            }}>Submit</PrimaryButton>
        </div>
    </div>
}

function SolanaSelector({setMetadata}: {
    setMetadata: (params: any) => void;
}) {
    const [amount, setAmount] = useState("");
    const [address, setAddress] = useState("");    

    return <div>
        <Input label={"To"} type={"text"} placeholder="To" onChange={(e) => setAddress(e.target.value)}></Input>
        <Input label={"Amount"} type={"text"} placeholder="To" onChange={(e) => setAmount(e.target.value)}></Input>
        <div className="pt-4">
        <PrimaryButton onClick={() => {
            setMetadata({
                amount,
                address
            })
        }}>Submit</PrimaryButton>
        </div>
    </div>
}

