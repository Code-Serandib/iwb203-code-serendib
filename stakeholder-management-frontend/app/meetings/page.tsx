"use client"
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
import Multiselect from 'multiselect-react-dropdown' // Import the Multiselect component

// Define the Meeting and Stakeholder types
type Meeting = {
    id: number
    title: string
    description: string
    meeting_date: string
    meeting_time: string
    location: string
    stakeholders: string
}

type Stakeholder = {
    id: number
    stakeholder_name: string
}

type Attendance = {
    stakeholderId: number
    attendance: boolean
}

export default function MeetingsPage() {
    const [meetings, setMeetings] = useState<Meeting[]>([])
    const [stakeholders, setStakeholders] = useState<Stakeholder[]>([]) // State for all stakeholders
    const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null)
    const [newMeeting, setNewMeeting] = useState<{
        title: string;
        date: Date;
        time: string;
        stakeholders: Stakeholder[];
        location: string;
        description: string
    }>({
        title: '',
        date: new Date(),
        time: '',
        stakeholders: [],
        location: '',
        description: ''
    });
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [isMeetingDetailsOpen, setIsMeetingDetailsOpen] = useState(false)
    const [filter, setFilter] = useState<'upcoming' | 'all'>('all') // Filter state
    const [attendance, setAttendance] = useState<{ [key: string]: boolean }>({}) // Attendance state
    const [error, setError] = useState('')

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

    // Fetch all stakeholders for selection
    useEffect(() => {
        const userEmail = localStorage.getItem('email');
        const token = localStorage.getItem('token');
        if (userEmail) {
            axios.get(`http://localhost:9091/api/getAllStakeholder`, {
                params: {
                    user_email: userEmail
                }
            })
                .then(response => {
                    console.log('Stakeholders data:', response.data);
                    setStakeholders(response.data);
                })
                .catch(error => {
                    console.error('Error fetching stakeholders:', error);
                });
        } else {
            console.error('User email or token not found in localStorage');
        }
    }, []);

    const handleNewMeeting = (e: React.FormEvent) => {
        e.preventDefault()

        if (newMeeting.stakeholders.length === 0) {
            setError('Please select at least one stakeholder')
            return
        }

        const formattedDate = newMeeting.date.toISOString().split('T')[0]

        const updatedMeeting = {
            title: newMeeting.title,
            description: newMeeting.description,
            meeting_date: formattedDate,
            meeting_time: newMeeting.time,
            location: newMeeting.location,
            stakeholders: newMeeting.stakeholders.map(stakeholder => stakeholder.id), // Get IDs of selected stakeholders
        }

        axios.post('http://localhost:9091/api/schedule_meeting', updatedMeeting)
            .then(response => {
                setMeetings(prevMeetings => [...prevMeetings, response.data])
                setNewMeeting({ title: '', date: new Date(), time: '', stakeholders: [], location: '', description: '' })
                setIsDialogOpen(false)
            })
            .catch(error => {
                console.error('Error creating meeting:', error)
            })
    }

    const handleMeetingClick = async (id: number) => {
        try {
            // Fetch meeting details
            const response = await axios.get(`http://localhost:9091/api/meetings/${id}`);
            setSelectedMeeting(response.data);

            // Fetch attendance data
            const attendanceResponse = await axios.get(`http://localhost:9091/api/attendance/${id}`);
            const attendanceData: Attendance[] = attendanceResponse.data;

            // Initialize attendance state for stakeholders
            const initialAttendance = {};
            attendanceData.forEach(({ stakeholderId, attendance }) => {
                initialAttendance[stakeholderId] = attendance;
            });
            setAttendance(initialAttendance);
            setIsMeetingDetailsOpen(true);
        } catch (error) {
            console.error('Error fetching meeting details:', error);
        }
    }

    // Handle attendance change
    const handleAttendanceChange = (stakeholderId: number) => {
        setAttendance(prevState => {
            const newAttendance = !prevState[stakeholderId]; // Toggle attendance
            markAttendance(selectedMeeting?.id, stakeholderId, newAttendance); // Call API
            return {
                ...prevState,
                [stakeholderId]: newAttendance
            };
        });
    }

    const markAttendance = async (meetingId: number | undefined, stakeholderId: number, attended: boolean) => {
        try {
            await axios.post('http://localhost:9091/api/mark_attendance', {
                meetingId,
                stakeholderId,
                attended
            });
        } catch (error) {
            console.error('Error marking attendance:', error);
        }
    };

    // Handle stakeholder selection
    const handleStakeholderSelect = (selectedList: Stakeholder[], selectedItem: Stakeholder) => {
        setNewMeeting(prevState => ({
            ...prevState,
            stakeholders: selectedList
        }))
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gradient-to-br from-gray-100 to-white p-8">
                <div className="mx-auto">
                    <header className="flex justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-black">Stakeholder Meetings</h1>
                        <div className="flex space-x-4">
                            <Button onClick={() => setFilter('all')} className={`bg-${filter === 'all' ? 'black' : 'gray-500'} text-white`}>
                                All Meetings
                            </Button>
                            <Button onClick={() => setFilter('upcoming')} className={`bg-${filter === 'upcoming' ? 'black' : 'gray-500'} text-white`}>
                                Upcoming Meetings
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
                                            <Label htmlFor="stakeholders">Select Stakeholders</Label>
                                            <Multiselect
                                                options={stakeholders} // Options to display in the dropdown
                                                selectedValues={newMeeting.stakeholders} // Preselected values
                                                onSelect={handleStakeholderSelect} // Function will trigger on select event
                                                onRemove={handleStakeholderSelect} // Function will trigger on remove event
                                                displayValue="stakeholder_name" // Property to display in the dropdown
                                                showCheckbox={true} // Show checkboxes for options
                                                selectedStyle={{ color: 'black' }} // Style for selected options
                                                className="my-2"
                                            />
                                            {error && <p className="text-red-500">{error}</p>}
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
                        </div>
                    </header>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Meeting Title</TableHead>
                                <TableHead>Meeting Date</TableHead>
                                <TableHead>Meeting Time</TableHead>
                                <TableHead>Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {meetings.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} className="text-center p-4 text-gray-500">
                                        No meetings found
                                    </TableCell>
                                </TableRow>
                            ) : (
                                meetings.map(meeting => (
                                    <TableRow key={meeting.id}>
                                        <TableCell>{meeting.title}</TableCell>
                                        <TableCell>{meeting.meeting_date}</TableCell>
                                        <TableCell>{meeting.meeting_time}</TableCell>
                                        <TableCell>
                                            <Button onClick={() => handleMeetingClick(meeting.id)} className="bg-black text-white hover:bg-gray-800">
                                                View Details
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>

                </div>
            </div>

            {/* Meeting Details Dialog */}
            <Dialog open={isMeetingDetailsOpen} onOpenChange={setIsMeetingDetailsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Meeting Details</DialogTitle>
                        <DialogDescription>{selectedMeeting?.description}</DialogDescription>
                    </DialogHeader>
                    <h2 className="text-lg font-bold">Stakeholders Attendance</h2>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Stakeholder</TableHead>
                                <TableHead>Attendance</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {stakeholders.map(stakeholder => (
                                <TableRow key={stakeholder.id}>
                                    <TableCell>{stakeholder.stakeholder_name}</TableCell>
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={attendance[stakeholder.id] || false}
                                            onChange={() => handleAttendanceChange(stakeholder.id)}
                                        />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </DialogContent>
            </Dialog>
        </Layout>
    )
}
