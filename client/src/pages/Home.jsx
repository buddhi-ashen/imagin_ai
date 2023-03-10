import React, { useEffect, useState } from 'react'

import { Card, FormField, Loader } from '../components'

const RenderCards = ({ data, title }) => {
  if (data?.length > 0) {
    return data.map((post) => <Card key={post._id} {...post} />)
  }

  return (
    <h2 className='mt-5 font-bold text-[#6469ff] text-xl uppercase'>{title}</h2>
  )
}

const Home = () => {
  const [loading, setLoading] = useState(false)
  const [allPosts, setAllPosts] = useState(null)

  const [searchText, setSearchText] = useState('')
  const [searchTimeout, setSearchTimeout] = useState(null)
  const [searchedResults, setSearchedResults] = useState(null)

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true)

      try {
        const response = await fetch('https://dall-e-clone-awf6.onrender.com/api/v1/posts', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (response.ok) {
          const result = await response.json()
          setAllPosts(result.data.reverse())
        }
      } catch (err) {
        alert(err)
      } finally {
        setLoading(false)
      }
    }
    fetchPosts()
  }, [])

  const handleSearchChange = (e) => {
    clearTimeout(searchTimeout)
    setSearchText(e.target.value)

    setSearchTimeout(
      setTimeout(() => {
        const searchResult = allPosts.filter(
          (item) =>
            item.name.toLowerCase().includes(searchText.toLowerCase()) ||
            item.prompt.toLowerCase().includes(searchText.toLowerCase())
        )
        setSearchedResults(searchResult)
      }, 500)
    )
  }

  return (
    <section className='max-w-7xl mx-auto'>
      <section className='bg-cover bg-gradient-to-r from-purple-500 to-pink-500 p-20'>
        <h1 className='text-6xl text-center font-sans font-bold text-white pt-5 pb-15'>
          Imagin Ai<br/>
          <p className='text-4xl text-center font-mono text-white pt-3 mb-8'>The Community Showcase</p>
        </h1>
        <p className='text-center text-white'>
        Welcome to our collection of imaginative and visually stunning images generated by DALL-E AI. Explore a world of endless possibilities as you browse through a curated selection of unique and captivating images. From mesmerizing landscapes to surreal scenes, each image has been crafted using the cutting-edge technology of DALL-E AI. Get lost in the beauty and wonder of these creations and let your imagination run wild. Discover new worlds and perspectives as you explore our collection of DALL-E generated images. Start your journey now.
        </p>
        <p></p>
      </section>

      <div className='mt-16'>
        <FormField
          labelName='Search posts'
          type='text'
          name='text'
          placeholder='Search something...'
          value={searchText}
          handleChange={handleSearchChange}
        />
      </div>

      <div className='mt-10'>
        {loading ? (
          <div className='flex justify-center items-center'>
            <Loader />
          </div>
        ) : (
          <>
            {searchText && (
              <h2 className='font-medium text-[#666e75] text-xl mb-3'>
                Showing Resuls for{' '}
                <span className='text-[#222328]'>{searchText}</span>:
              </h2>
            )}
            <div className='grid lg:grid-cols-4 sm:grid-cols-3 xs:grid-cols-2 grid-cols-1 gap-3'>
              {searchText ? (
                <RenderCards
                  data={searchedResults}
                  title='No Search Results Found'
                />
              ) : (
                <RenderCards data={allPosts} title='No Posts Yet' />
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Home
