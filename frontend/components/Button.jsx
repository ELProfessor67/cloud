import { Button as ShadButton } from "@/components/ui/button"
import { Loader, Loader2 } from "lucide-react"

export const Button = ({ children, isLoading, ...props }) => {
    return <ShadButton {...props} disabled={isLoading} className={`${isLoading ? "opacity-50" : ""} ${props.className}`}>
        {isLoading &&
            <Loader2 className="animate-spin" />
        }
        {children}
    </ShadButton>
}