'use client'

import { useState } from 'react'

import ButtonOutline from '@/components/ui/button-outline'
import { Card } from '@/components/ui/card'
import { useCreateShowcase, useDeleteShowcase, useShowcases } from '@/hooks/use-showcases'
import { Link } from '@/i18n/routing'
import { baseUrl } from '@/lib/utils'
import { cn } from '@/lib/utils'
import type { Persona, Showcase } from 'bc-wallet-openapi'
import { CopyButton } from '../ui/copy-button'
import { DeleteButton } from '../ui/delete-button'
import { OpenButton } from '../ui/external-open-button'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Header from '../header'
import { env } from '@/env'
import { showcaseStatusLabels } from '@/lib/status-mapping'
import { Button } from '../ui/button'

const WALLET_URL = env.NEXT_PUBLIC_WALLET_URL

export const ShowcaseList = () => {
  const t = useTranslations()
  const { data, isLoading } = useShowcases()
  const { mutateAsync } = useCreateShowcase()
  const { mutateAsync: deleteShowcase } = useDeleteShowcase()
  const tabs = [
    { label: t('showcases.header_tab_overview'), status: 'ALL' },
    { label: t('showcases.header_tab_draft'), status: 'PENDING' },
    { label: t('showcases.header_tab_under_review'), status: 'UNDER_REVIEW' },
    { label: t('showcases.header_tab_published'), status: 'ACTIVE' },
  ]

  const [activeTab, setActiveTab] = useState(tabs[0])
  const [searchTerm, setSearchTerm] = useState('')

  const searchFilter = (showcase: Showcase) => {
    if (searchTerm === '') {
      return true
    }
    return showcase.name.toLowerCase().includes(searchTerm.toLowerCase())
  }

  const createShowcase = async () => {
    const response = await mutateAsync(
      {
        name: 'BC Gov Showcase',
        description: 'Collection of credential usage scenarios',
        status: 'ACTIVE',
        hidden: false,
        tenantId: 'test-tenant-1',
        scenarios: ['8a9d9619-7522-453c-b068-3408ef4eca62', 'fee9c14d-b39b-460e-b4c7-20fb5ddc5c46'],
        personas: ['b3f83345-4448-4d21-a3d3-5d7b719c45d8'],
      },
      {
        onSuccess: (data: unknown) => {
          console.log('Showcase Created:', data)
        },
      },
    )

    return response
  }

  return (
    <>
      <main className={`flex-1 bg-light-bg dark:bg-dark-bg text-foreground `}>
        <Header
          title={t('showcases.header_title')}
          showSearch={true}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          buttonLabel={t('showcases.create_new_showcase_label')}
          buttonLink="/showcases/create"
        />

        {!isLoading && (
          <div className="mx-auto px-5 mt-2 ">
            <div className="flex gap-6 text-sm font-medium">
              {tabs.map((tab, index) => {
                const showcaseCount =
                  tab.status === tabs[0].status
                    ? data?.showcases?.length || 0
                    : data?.showcases?.filter((showcase) => showcase.status === tab.status).length || 0

                return (
                  <button
                    key={index}
                    className={`flex items-center gap-1 py-1 ${activeTab.status === tab.status
                      ? 'border-b-2 border-foreground/80 text-foreground font-bold cursor-pointer'
                      : 'text-foreground/50 hover:text-foreground/80 cursor-pointer'
                      }`}
                    onClick={() => setActiveTab(tab)}
                  >
                    <div className="font-bold text-base">{tab.label}</div>
                    <span className="bg-foreground/10 text-foreground/80 text-xs px-2 py-0.5 rounded-full">
                      {showcaseCount}
                    </span>
                  </button>
                )
              })}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-gray-300 border-t-blue-500 rounded-full animate-spin"></div>
            {t('showcases.loading_label')}
          </div>
        )}

        <section className="mx-auto p-4">
          <div className="grid md:grid-cols-3 gap-6 mt-6 pb-4">
            {data?.showcases
              ?.filter(searchFilter)
              .filter((showcase) => activeTab.status === tabs[0].status || showcase.status === activeTab.status)
              .reverse()
              .map((showcase: Showcase) => (
                <Card key={showcase.id}>
                  <div
                    key={showcase.id}
                    className="bg-white dark:bg-dark-bg rounded-lg overflow-hidden border border-foreground/20 flex flex-col h-full"
                  >
                    <div
                      className="relative min-h-[15rem] h-auto flex items-center justify-center bg-cover bg-center"
                      style={{
                        backgroundImage: `url('${showcase?.bannerImage?.id ? `${baseUrl}/assets/${showcase.bannerImage.id}/file` : '/assets/NavBar/Showcase.jpeg'
                          }')`,
                      }}
                    >
                      <div
                        className={cn(
                          'absolute top-4 left-4 rounded-md px-3 py-1 text-md font-normal shadow',
                          showcase.status == 'ACTIVE' ? 'bg-yellow-500' : 'bg-dark-grey',
                        )}
                      >
                        <p className={cn('text-center', showcase.status == 'ACTIVE' ? 'text-black' : 'text-white')}>
                          <span>{showcaseStatusLabels[showcase.status] || showcase.status}</span>

                        </p>
                      </div>
                      <div className="absolute bg-black bottom-0 left-0 right-0 bg-opacity-70 p-3">
                        <p className="text-xs text-white break-words">
                          {t('showcases.created_by_label', {
                            name: 'Test college',
                          })}
                        </p>
                        <div className="flex justify-between">
                          <h2 className="text-lg font-bold text-white break-words">{showcase?.name}</h2>
                          <div className="flex-shrink-0">
                            <CopyButton value={`${WALLET_URL}/${showcase.slug}`} />
                            <OpenButton value={`${WALLET_URL}/${showcase.slug}`} />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="p-5 flex flex-col flex-grow">
                      <h3 className="text-sm font-semibold text-foreground">
                        {t('showcases.description_label')}
                      </h3>
                      <p className="text-foreground/80 text-xs">{showcase.description}</p>
                      <h3 className="text-sm font-semibold text-foreground mt-2">
                        {t('showcases.description_version')}
                      </h3>
                      <p className="text-foreground/80 text-xs">1.0</p>

                      <div className="mt-4 flex-grow mb-4">
                        <h4 className="text-sm font-semibold text-foreground">
                          {t('showcases.character_label')}
                        </h4>
                        <div className="mt-2 space-y-3">
                          {showcase?.personas?.map((persona: Persona) => (
                            <div
                              key={persona.id}
                              className="border-[1px] border-foreground/20 flex items-center gap-3 p-3 rounded-md"
                            >
                              <Image
                                src={
                                  persona.headshotImage?.id
                                    ? `${baseUrl}/assets/${persona.headshotImage.id}/file`
                                    : '/assets/no-image.jpg'
                                }
                                alt={persona.headshotImage?.description || 'Character headshot'}
                                width={44}
                                height={44}
                                className="rounded-full w-[44px] h-[44px]"
                              />
                              <div>
                                <p className="text-base text-foreground font-semibold">{persona.name}</p>
                                <p className="text-xs text-foreground/80">{persona.role}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-4 mt-auto">
                        <Link className="w-1/2" href={`/showcases/${showcase.slug}`}>
                          <Button 
                            className="w-full"
                            variant="outlineAction"
                            onClick={() => deleteShowcase(showcase.slug)}
                          >
                            {t('action.edit_label')}
                          </Button>
                        </Link>
                        <Button variant="outlineAction" onClick={() => createShowcase()} disabled className="w-1/2">
                          {t('action.create_copy_label')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </section>

        {/* <DeleteModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onDelete={() => {
            setIsModalOpen(false);
          }}
          header="Edit Published Showcase?"
          description="You are about to edit a published showcase. If you instead wish to make a copy, click <b>Cancel</b> below and then select <b>Create A Copy</b> under the showcase card"
          subDescription="If you proceed with editing, a <b>Draft version</b> will be created. This Draft will remain unpublished until an Admin approves your changes. <b>Until then, the current published showcase will stay active.</b>"
          cancelText="CANCEL"
          deleteText="PROCEED WITH EDITING"
        /> */}
      </main>
    </>
  )
}
