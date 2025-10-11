import React from 'react'
import { Button } from '../ui/button'
import { Plus } from 'lucide-react';

const Mockup = () => {
    const notes = [
        { id: 1, title: 'Project kickoff agenda', snippet: 'Clarify scope, risks, milestones. Define responsibilities and comms channels.', tags: '#work · #meeting', time: '2h ago' },
        { id: 2, title: 'App architecture ideas', snippet: 'Use modular services, queue for AI tasks, optimistic UI for quick notes.', tags: '#ideas', time: 'Yesterday' },
        { id: 3, title: 'Grocery list', snippet: 'Spinach, oats, eggs, yogurt, almonds, apples, tomatoes.', tags: '#personal', time: 'Mon' },
        { id: 4, title: 'Blog outline: Deep work', snippet: 'Intro, context switching costs, batching, focus sprints, tools.', tags: '#writing', time: 'Sun' },
        
      ];
    return (
        <div className=' w-full border
        rounded-md'>
            <div className='flex items-center py-1 px-2 gap-2 border-b'>
                <div className='flex items-center gap-1'>
                    <div className="size-2 rounded-full bg-red-500"></div>
                    <div className="size-2 rounded-full bg-yellow-500"></div>
                    <div className="size-2 rounded-full bg-green-500"></div>
                </div>
                <span className='text-primary text-xs'>notora.vecel.app/notes</span>
            </div>
            <div className='grid grid-cols-12'>
                <div className='md:flex flex-col h-full gap-2 hidden col-span-3 border-r p-2'>
                    <Button size={'sm'} variant={'ghost'} className={`w-full text-start text-xs font-medium justify-start bg-accent text-primary`}>Home</Button>
                    <Button size={'sm'} variant={'ghost'} className={`w-full text-start text-xs font-medium justify-start hover:bg-accent`}>Archived</Button>
                    <Button size={'sm'} variant={'ghost'} className={`w-full text-start text-xs font-medium justify-start hover:bg-accent`}>Folder</Button>
                    <Button size={'sm'} variant={'ghost'} className={`w-full text-start text-xs font-medium justify-start hover:bg-accent`}>Delete</Button>
                </div>
                <div className='col-span-12 md:col-span-9'>
                    <div className='p-2 border-b flex items-center justify-between'>
                        <h2 className='font-semibold text-primary'>Notes</h2>
                        <Button size={'xs'} variant={'outline'} className={`text-xs gap-0.5 font-medium pr-1 pl-0.5 py-1`}>
                            <Plus size={10}/>
                            <span>New</span>
                        </Button>
                    </div>
                    <div className='grid grid-cols-2 gap-2 p-2'>
                        {
                            notes.map((item) => 
                            <div className='flex flex-col justify-between gap-3 p-3 border bg-accent/30 hover:bg-accent rounded-md' key={item.id}>
                                <div>
                                    <h3 className='text-base font-semibold text-primary mb-2'>{item.title}</h3>
                                    <p className='text-xs line-clamp-2'>{item.snippet}</p>
                                </div>
                                <div className='flex items-center justify-between'>
                                    <span className='text-xs'>{item.tags}</span>
                                    <span className='text-xs'>{item.time}</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Mockup