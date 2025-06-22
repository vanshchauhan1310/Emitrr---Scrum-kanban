import { useState } from "react"
import { toast } from "sonner"

const useFetch = <T>(cb: (...args: any[]) => Promise<T>) => {
   const [isLoading, setIsLoading] = useState(false)
   const [error, setError] = useState<string | null>(null)
   const [data, setData] = useState<T | null>(null)

   const fetchData = async (...args: any[]) => {
    setIsLoading(true)
    setError(null)
    try {
        const response = await cb(...args)
        setData(response)
        setError(null)
    } catch (error) {
        setError(error instanceof Error ? error.message : 'An error occurred')
        toast.error(error instanceof Error ? error.message : 'An error occurred')
    } finally {
        setIsLoading(false)
    }
   }

   return {
    isLoading,
    error,
    data,
    fetchData,
    setData,
   }
}

export default useFetch 