import Head from 'next/head'
import Image from 'next/image'
import styles from '@/styles/Home.module.css'
import Layout from '@/components/layout'
import Comment from '@/components/comment'
import Thread from '@/components/thread';
import axios from "axios";
import { useEffect, useState, ChangeEvent } from "react";
import { DataWithPagination } from "@/types/dataWithPagination"
import { threadType } from "@/types/thread"
import { useRouter } from "next/router";

const sample = {
  current_page: 0,
  last_page: 0,
  path: "",
  per_page: 0,
  from: 0,
  to: 0,
  total: 0,
  links: {
      url: "",
      label: "",
      active: true,
    }
  };


export default function Home() {
  const [ threads, setThreads ] = useState<threadType[]>([]);

  const [ page, setPage ] = useState<DataWithPagination>(sample);

  const [ pageIndex , setPageIndex ] = useState(1);


  const [ genre, setGenre] = useState<string>('');
  
  const router = useRouter();
  
  const updatedMemo = (
    e: ChangeEvent<HTMLSelectElement>
    ) => {
      setGenre(e.target.value);
    }
    
  useEffect (() => {
    const URL = `http://localhost:8000/api/threads?page=${pageIndex}`;
    const dos = () => {
      try {
        const getThreads = async () => {
          const res = await axios.get(URL);
          setPage(res.data)
          setThreads(res.data.data);
        }
        getThreads();
      } catch (e) {
        return e;
      }
    }
    dos();
    if (genre) {
      router.push(`/Sort/${genre}`)
    }
  }, [pageIndex, genre, router]);

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
      {threads.map((thread: threadType) => ( <Thread key={thread.id} thread={thread} />))}

      <div className="text-right mr-20">
        <div className="flex flex-col items-center">
          <span className="text-sm text-gray-700 dark:text-gray-400">
              Showing <span className="font-semibold text-gray-900 dark:text-white">1</span> to <span className="font-semibold text-gray-900 dark:text-white">{page.last_page}</span> of <span className="font-semibold text-gray-900 dark:text-white">{page.current_page}</span> Entries
          </span>
          <div className="inline-flex mt-2 xs:mt-0">
              <button onClick={() => setPageIndex(pageIndex - 1)} className="px-4 py-2 text-sm font-medium text-white bg-gray-800 rounded-l hover:bg-gray-900 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white">
                  Prev
              </button>
              {page.last_page != page.current_page ?
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