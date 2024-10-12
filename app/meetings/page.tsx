'use client'

import { useEffect, useState } from 'react'
import axios from 'axios'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { CalendarDays, Plus, BarChart } from 'lucide-react'
import Layout from '@/components/layout/Layout'

// Define the Meeting type to match your backend response structure
type Meeting = {
    id: number
    title: string
    description: string
    meeting_date: string
    meeting_time: string
    location: string
    stakeholders: string
}

export default function MeetingsPage() {
    const [meetings, setMeetings] = useState<Meeting[]>([])
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
    const [newMeeting, setNewMeeting] = useState<{ title: string; date: Date; time: string; stakeholders: string; location: string; description: string }>({
        title: '',
        date: new Date(),
        time: '',
        stakeholders: '',
        location: '',
        description: ''
    })
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isMeetingDetailsOpen, setIsMeetingDetailsOpen] = useState(false)
    const [filter, setFilter] = useState<'upcoming' | 'all'>('upcoming') // Filter state
    const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({}) // Attendance state

    // Fetch meetings from backend based on the filter
    useEffect(() => {
        const endpoint = filter === 'upcoming' ? 'http://localhost:9091/api/upcoming_meetings' : 'http://localhost:9091/api/all_meetings'
        axios.get(endpoint)
            .then(response => {
                setMeetings(response.data)
            })
            .catch(error => {
                console.error('Error fetching meetings:', error)
            })
    }, [filter])

    const handleNewMeeting = (e: React.FormEvent) => {
        e.preventDefault()

        const formattedDate = newMeeting.date.toISOString().split('T')[0]

        const updatedMeeting = {
            title: newMeeting.title,
            description: newMeeting.description,
            meeting_date: formattedDate,
            meeting_time: newMeeting.time,
            location: newMeeting.location,
            stakeholders: newMeeting.stakeholders
        }

        axios.post('http://localhost:9091/api/schedule_meeting', updatedMeeting)
            .then(response => {
                setMeetings(prevMeetings => [...prevMeetings, response.data])
                setNewMeeting({ title: '', date: new Date(), time: '', stakeholders: '', location: '', description: '' })
                setIsDialogOpen(false)
            })
            .catch(error => {
                console.error('Error creating meeting:', error)
            })
    }

    const handleMeetingClick = (id: number) => {
        axios.get(`http://localhost:9091/api/meetings/${id}`)
            .then(response => {
                setSelectedMeeting(response.data)
                // Initialize attendance state for stakeholders
                const initialAttendance = response.data.stakeholders.split(',').reduce((acc: any, stakeholder: string) => {
                    acc[stakeholder.trim()] = false
                    return acc
                }, {})
                setAttendance(initialAttendance)
                setIsMeetingDetailsOpen(true)
            })
            .catch(error => {
                console.error('Error fetching meeting details:', error)
            })
    }

    // Handle attendance change
    const handleAttendanceChange = (stakeholder: string) => {
        setAttendance(prevState => ({
            ...prevState,
            [stakeholder]: !prevState[stakeholder]
        }))
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-8">
                <div className="mx-auto">
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-black">Stakeholder Meetings</h1>
                        <div className="flex space-x-4">
                            <Button onClick={() => setFilter('upcoming')} className={`bg-${filter === 'upcoming' ? 'black' : 'gray-500'} text-white`}>
                                Upcoming Meetings
                            </Button>
                            <Button onClick={() => setFilter('all')} className={`bg-${filter === 'all' ? 'black' : 'gray-500'} text-white`}>
                                All Meetings
                            </Button>
                            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                                <DialogTrigger asChild>
                                    <Button className="bg-black text-white hover:bg-gray-800">
                                        <Plus className="mr-2 h-4 w-4" /> Schedule Meeting
                                    </Button>
                                </DialogTrigger>
                                <DialogContent className="max-h-[80vh] overflow-y-auto">
                                    <DialogHeader>
                                        <DialogTitle>Schedule New Meeting</DialogTitle>
                                        <DialogDescription>Enter the details for the new stakeholder meeting.</DialogDescription>
                                    </DialogHeader>
                                    <form onSubmit={handleNewMeeting} className="space-y-4">
                                        <div>
                                            <Label htmlFor="title">Meeting Title</Label>
                                            <Input
                                                id="title"
                                                value={newMeeting.title}
                                                onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="date">Date</Label>
                                            <Calendar
                                                mode="single"
                                                selected={newMeeting.date}
                                                onSelect={(date) => setNewMeeting({ ...newMeeting, date: date || new Date() })}
                                                className="rounded-md border"
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="time">Time</Label>
                                            <Input
                                                id="time"
                                                type="time"
                                                value={newMeeting.time}
                                                onChange={(e) => setNewMeeting({ ...newMeeting, time: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="stakeholders">Stakeholders (comma-separated)</Label>
                                            <Input
                                                id="stakeholders"
                                                value={newMeeting.stakeholders}
                                                onChange={(e) => setNewMeeting({ ...newMeeting, stakeholders: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="location">Location</Label>
                                            <Input
                                                id="location"
                                                value={newMeeting.location}
                                                onChange={(e) => setNewMeeting({ ...newMeeting, location: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <div>
                                            <Label htmlFor="description">Description</Label>
                                            <Input
                                                id="description"
                                                value={newMeeting.description}
                                                onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                                                required
                                            />
                                        </div>
                                        <Button type="submit" className="w-full bg-black text-white hover:bg-gray-800">Schedule Meeting</Button>
                                    </form>
                                </DialogContent>
                            </Dialog>
                            <Link href="/meetings/analytics">
                                <Button variant="outline" className="border-black text-black hover:bg-black hover:text-white">
                                    <BarChart className="mr-2 h-4 w-4" /> Meeting Analytics
                                </Button>
                            </Link>
                        </div>
                    </header>

                    <Card>
                        <CardHeader>
                            <CardTitle>{filter === 'upcoming' ? 'Upcoming Meetings' : 'All Meetings'}</CardTitle>
                            <CardDescription>View and manage your scheduled stakeholder meetings</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Title</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead>Time</TableHead>
                                        <TableHead>Stakeholders</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {meetings.map((meeting: Meeting) => (
                                        <TableRow key={meeting.id} onClick={() => handleMeetingClick(meeting.id)} className="cursor-pointer">
                                            <TableCell className="font-medium">{meeting.title}</TableCell>
                                            <TableCell>{meeting.meeting_date}</TableCell>
                                            <TableCell>{meeting.meeting_time}</TableCell>
                                            <TableCell>{meeting.stakeholders}</TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </CardContent>
                    </Card>

                    {selectedMeeting && (
                        <Dialog open={isMeetingDetailsOpen} onOpenChange={setIsMeetingDetailsOpen}>
                            <DialogContent>
                                <DialogHeader>
                                    <DialogTitle>{selectedMeeting.title}</DialogTitle>
                                    <DialogDescription>{selectedMeeting.description}</DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                    <p><strong>Date:</strong> {selectedMeeting.meeting_date}</p>
                                    <p><strong>Time:</strong> {selectedMeeting.meeting_time}</p>
                                    <p><strong>Location:</strong> {selectedMeeting.location}</p>
                                    <div>
                                        <h4 className="font-bold">Stakeholders</h4>
                                        <ul>
                                            {selectedMeeting.stakeholders.split(',').map((stakeholder: string) => (
                                                <li key={stakeholder} className="flex items-center space-x-2">
                                                    <input
                                                        type="checkbox"
                                                        checked={attendance[stakeholder.trim()]}
                                                        onChange={() => handleAttendanceChange(stakeholder.trim())}
                                                    />
                                                    <span>{stakeholder.trim()}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            </DialogContent>
                        </Dialog>
                    )}
                </div>
            </div>
        </Layout>
    )
}
