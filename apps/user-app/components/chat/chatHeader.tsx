"use client"

import { Button } from "@repo/ui/components/ui/button"
import { Settings } from "@repo/ui/icons/setting"

export function ChatHeader(){
    return <div className="border-b-2 dark:border-b-slate-500 px-6 py-4 flex items-center justify-between backdrop-blur">
        <div>
            <h2 className="text-xl font-semibold">Room 1</h2>
            <p className="text-sm text-gray-500">A place for general chat and discussions</p>
        </div>
        <div>
                <Settings className="m-4 cursor-pointer" />
        </div>
    </div>
}