'use client'

import React, { useState } from 'react'
import { useTranslations } from 'next-intl'
import { useShowcases } from '@/hooks/use-showcases'
import { Showcase } from '@/openapi-types'
import Header from '../header'
import ShowcaseCard from '../showcases-screen/showcase-card'

export const LandingPage = () => {
  const t = useTranslations()
  const [searchTerm, setSearchTerm] = useState('')
  const { data, isLoading } = useShowcases()

  const searchFilter = (showcase: Showcase) => {
    if (searchTerm === '') {
      return true
    }
    return showcase.name.toLowerCase().includes(searchTerm.toLowerCase())
  }

  return (
    <>
      <Header title={t('home.header_title')} searchTerm={searchTerm} setSearchTerm={setSearchTerm} />

      {/* {!isLoading && (
        <div className="container mx-auto px-5 mt-2">
          <div className="flex gap-4 text-sm font-medium">
            {tabs.map((tab, index) => (
              <button
                key={index}
                className={`flex items-center gap-1 px-2 py-1 ${
                  activeTab === tab
                    ? "border-b-2 border-light-blue dark:border-white dark:text-dark-text text-light-blue font-bold cursor-pointer"
                    : "text-gray-800/50 dark:text-gray-200/50"
                }`}
                onClick={() => setActiveTab(tab)}
              >
                <div className="font-bold text-base">{tab}</div>
                <span className="bg-light-bg-secondary dark:dark-bg-secondary text-gray-600 text-xs px-2 py-0.5 rounded-full">
                  {index === 0 ? data?.showcases.length : index === 1 ? 1 : 2}
                </span>
              </button>
            ))}
          </div>
        </div>
      )} */}

      {isLoading && (
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
          {t('showcases.loading_label')}
        </div>
      )}
      <section className="mx-auto p-4">
        <div className="grid md:grid-cols-3 gap-6 mt-6 pb-4">
          {data?.showcases.filter(searchFilter).map((showcase: Showcase) => (
            <ShowcaseCard showcase={showcase} key={showcase.id} variant="public" />
          ))}
        </div>
      </section>
    </>
  )
}

export default LandingPage
