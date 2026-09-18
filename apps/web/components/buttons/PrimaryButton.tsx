import { ReactNode } from "react"

export const PrimaryButton = ({ children, onClick, size = "small" }: {
    children: ReactNode,
    onClick: () => void,
    size?: "big" | "small"
}) => {
    return <div onClick={onClick} className={`${size === "small" ? "text-sm" : "text-xl"} ${size === "small" ? "px-4 py-3" : "px-10 py-4"} cursor-pointer bg-amber-700 text-white rounded-full text-center flex justify-center flex-col`}>
        {children}
    </div>
}