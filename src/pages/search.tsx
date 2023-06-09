import Thread from '@/components/thread';
import { useEffect, useState, ChangeEvent, useMemo } from "react";
import { useTheme } from "@/context/ThemeContext"
import { usePagination } from "@/context/PaginationContext"
import axios from "axios";
import { useSent } from "@/context/SentContext"
import { useRouter } from "next/router";
import { useSearch } from "@/context/SearchContext";

type threadType = {
  id: number,
  sum: number,
  theme: string,
  genre: string,
  date: string,
  created_at: string,
  updated_at: string,
}

export default function Home() {
  
  const { search, setSearch } = useSearch();
  const { theme, setTheme } = useTheme();
  const { pagination, setPagination } = usePagination();
  const { sent, setSent } = useSent();
  const [ pageIndex , setPageIndex ] = useState(1);
  const [ genre, setGenre] = useState<string>('');
  
  const router = useRouter();
  
  const updatedMemo = (
    e: ChangeEvent<HTMLSelectElement>
    ) => {
      setGenre(e.target.value)
    }
    // console.log(theme);
    
    // console.log(pagination)
    // console.log(sent, "a");
    
    useEffect (() => {
      const URL_SEARCH = `http://localhost:8000/api/theme?page=${pageIndex}`;
      const dos = () => {
        try {
          const getThreads = async () => {
            const res = await axios.post(URL_SEARCH, search).then((res) => {
              setPagination(res.data);
              setTheme(res.data.data);
            })
          }
          getThreads();
        } catch (e) {
          return e;
        }
      }
    dos();
    if (genre) {
      router.push(`/Sort/search/${genre}`)
    }
  }, [pageIndex, genre, router, setPagination, search, setTheme]);



  return (
    <>
    <select value={genre} onChange={updatedMemo} className="w-96 mt-8 ml-10 border-orange-300 border-2" name="genre" id="genre">
        <option value="">すべてのジャンルを表示</option>
        <option value="sports" >スポーツ</option>
        <option value="cooking" >料理</option>
        <option value="politics" >政治</option>
        <option value="economy" >経済</option>
        <option value="outdoor" >アウトドア</option>
        <option value="trip" >旅行</option>
        <option value="animal" >動物</option>
        <option value="game" >ゲーム</option>
        <option value="comic" >漫画</option>
        <option value="anime" >アニメ</option>
        <option value="others" >その他</option>
      </select>
      {theme.map((thread: threadType) => ( <Thread key={thread.id} thread={thread} />))}

      <div className="text-right mr-20">
              <div className="flex flex-col items-center">
                <span className="text-sm text-gray-700 dark:text-gray-400">
                    Showing <span className="font-semibold text-gray-900 dark:text-white">1</span> to <span className="font-semibold text-gray-900 dark:text-white">{pagination.last_page}</span> of <span className="font-semibold text-gray-900 dark:text-white">{pagination.current_page}</span> Entries
                </span>
                <div className="inline-flex mt-2 xs:mt-0">
                    <button onClick={() => setPageIndex(pageIndex - 1)} className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        Prev
                    </button>
                    {pagination.last_page != pagination.current_page ?
                    <button onClick={() => setPageIndex(pageIndex + 1)} className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                        Next
                    </button>:
                    <button className="px-4 py-2 text-sm font-medium text-white bg-gray-800 border-0 border-l border-gray-700 rounded-r hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                    End
                    </button>
                    }
                </div>
              </div>
            </div>
    </>
  )
}
