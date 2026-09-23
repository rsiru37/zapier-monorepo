"use client";

export const Input = ({label, placeholder, onChange, type = "text"}: {
    label: string;
    placeholder: string;
    onChange: (e: any) => void;
    type?: "text" | "password"
}):React.ReactElement => {
    return <div className="flex flex-col w-80">
        <div className="text-sm pb-1 pt-2">
             <label>{label}</label>
        </div>
        <input className="border rounded px-4 py-2 w-full border-black" type={type} placeholder={placeholder} onChange={onChange} />
    </div>
}
