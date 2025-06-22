'use client'

import { useChat } from 'ai/react'
import { useEffect, useState } from 'react'

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const [displayedText, setDisplayedText] = useState('')
  const [typingIndex, setTypingIndex] = useState(0)
  const [theme, setTheme] = useState('dark')

  // Get the latest assistant message
  const latestAIMessage = messages
    .filter((m) => m.role === 'assistant')
    .slice(-1)[0]

  // Typing animation
  useEffect(() => {
    if (!latestAIMessage) return

    let content = latestAIMessage.content
    try {
      const parsed = JSON.parse(latestAIMessage.content)
      if (parsed && parsed.content) content = parsed.content
    } catch {}

    setDisplayedText('')
    setTypingIndex(0)

    let i = 0
    const interval = setInterval(() => {
      setDisplayedText(content.slice(0, i))
      i++
      setTypingIndex(i)
      if (i > content.length) clearInterval(interval)
    }, 20)

    return () => clearInterval(interval)
  }, [latestAIMessage?.id])

  // Toggle theme between light and dark
  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === 'dark' ? 'light' : 'dark'))
  }

  return (
    <div className={`flex flex-col h-screen w-full max-w-screen overflow-hidden ${theme === 'dark' ? 'bg-gradient-to-b from-gray-800 to-gray-900 text-white' : 'bg-gradient-to-b from-gray-200 to-gray-300 text-black'}`}>
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-opacity-80 backdrop-blur-lg border-b border-gray-700">
        <div className="w-full flex items-center justify-between">
          <h2 className="text-xl md:text-2xl lg:text-3xl font-bold truncate flex items-center">
            LOGIQ CURVE LLC
          </h2>
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {theme === 'dark' ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1M12 20v1m4.22-4.22l.707.707m-4.95-4.95l.707.707m-5.65-.22a9 9 0 1 1 9.19-9.19m-4.22 4.22a3 3 0 1 0-4.24-4.24m-1.41 1.41a1 1 0 1 1 1.42 1.42m.95-3.29a4.01 4.01 0 0 1 5.63 5.63M16 10a3 3 0 1 0-3-3m-7 3a3 3 0 1 0 3-3m4.5-5.5l-.707-.707" />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 2C6.48 2 2 6.48 2 12c0 5.52 4.48 10 10 10s10-4.48 10-10c0-5.52-4.48-10-10-10zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 p-3 sm:p-4 md:p-6 overflow-y-auto max-h-[calc(100vh-150px)]">
        <div className="flex flex-col space-y-4">
          {messages.map((m) => {
            let content = m.content
            try {
              const parsed = JSON.parse(m.content)
              if (parsed && parsed.content) content = parsed.content
            } catch {}

            const isLastAI = m.role === 'assistant' && m.id === latestAIMessage?.id

            return (
              <div key={m.id} className="flex">
                <div
                  className={`p-4 rounded-2xl break-words w-fit max-w-[85%] sm:max-w-[80%] ${
                    m.role === 'user'
                      ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white self-end ml-auto'
                      : 'bg-gradient-to-br from-amber-200 via-violet-600 to-sky-900 text-white self-start mr-auto'
                  }`}
                >
                  <span className="font-medium">{m.role === 'user' ? 'You' : 'AI'}:</span>{' '}
                  {isLastAI ? (
                    <span>{displayedText}<span className="animate-pulse">▍</span></span>
                  ) : (
                    <span>{content}</span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Input */}
      <form
        onSubmit={handleSubmit}
        className="flex items-center px-3 py-2 bg-gray-800 border-t border-gray-700 space-x-2"
      >
        <input
          className="flex-1 px-3 py-2 text-sm sm:text-base text-white bg-gray-700 border border-gray-600 rounded-full placeholder-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          type="text"
          placeholder="Say something..."
          value={input}
          onChange={handleInputChange}
        />
        <button
          type="submit"
          className="p-2 text-blue-400 rounded-full hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <svg
            className="w-5 h-5 sm:w-6 sm:h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
          </svg>
        </button>
      </form>
    </div>
  )
}
