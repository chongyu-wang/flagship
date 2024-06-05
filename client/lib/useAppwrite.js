import { useState, useEffect } from 'react'

const useAppwrite = (fn) => {
    const [data, setData] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = async () => {
        setIsLoading(true);
        try {
            const response = await fn();

            setData(response);
        } catch (error) {
            console.log(`error in useAppwrite.js in function ${fn}`);
            Alert("Error", error.message);
        } finally {
            setIsLoading(false)
        }
    }
  
    useEffect(() => {
      fetchData();
    },[])
    
    const refetch = () => fetchData();

    return { data, isLoading, refetch }
}

export default useAppwrite;