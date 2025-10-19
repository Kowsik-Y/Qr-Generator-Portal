'use client';

import { Home, BookOpen, PlusCircle, User, GraduationCap, Trophy, TrendingUp, Search } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';

export default function QuizPortalPage() {
  const [userRole, setUserRole] = useState('student');
  const [activePage, setActivePage] = useState('home');

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Quiz Portal</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">Learn & Grow</p>
        </div>

        <Separator />

        <nav className="flex-1 p-4 space-y-2">
          <SidebarItem
            icon={Home}
            label="Home"
            active={activePage === 'home'}
            onClick={() => setActivePage('home')}
          />
          <SidebarItem
            icon={BookOpen}
            label="Tests"
            active={activePage === 'tests'}
            onClick={() => setActivePage('tests')}
          />
          <SidebarItem
            icon={PlusCircle}
            label="Create Test"
            active={activePage === 'create'}
            onClick={() => setActivePage('create')}
          />
          <SidebarItem
            icon={User}
            label="Profile"
            active={activePage === 'profile'}
            onClick={() => setActivePage('profile')}
          />
        </nav>

        <div className="p-4">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-900/20 p-4">
            <p className="text-sm font-semibold text-blue-900 dark:text-blue-300">Role: {userRole === 'student' ? 'Student' : 'Teacher'}</p>
            <Button
              onClick={() => setUserRole(userRole === 'student' ? 'teacher' : 'student')}
              variant="outline"
              size="sm"
              className="w-full mt-2"
            >
              Switch to {userRole === 'student' ? 'Teacher' : 'Student'}
            </Button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activePage === 'home' && <HomePage userRole={userRole} />}
        {activePage === 'tests' && <TestsPage />}
        {activePage === 'create' && <CreateTestPage />}
        {activePage === 'profile' && <ProfilePage />}
      </main>
    </div>
  );
}

function SidebarItem({ icon: Icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
        active
          ? 'bg-blue-500 text-white'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
    >
      <Icon size={20} />
      <span className="font-medium">{label}</span>
    </button>
  );
}

function HomePage({ userRole }) {
  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Welcome Back!</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Ready to continue your learning journey?</p>
      </div>

      {/* Role Cards */}
      <div className="mb-8">
        <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">YOUR ROLE</h2>
        <div className="grid grid-cols-2 gap-4">
          <Card className={userRole === 'student' ? 'border-blue-500 border-2' : ''}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-full">
                  <GraduationCap className="text-blue-600 dark:text-blue-400" size={24} />
                </div>
                <div>
                  <CardTitle>Student</CardTitle>
                  <CardDescription>Take quizzes and learn</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
          <Card className={userRole === 'teacher' ? 'border-blue-500 border-2' : ''}>
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-full">
                  <User className="text-purple-600 dark:text-purple-400" size={24} />
                </div>
                <div>
                  <CardTitle>Teacher</CardTitle>
                  <CardDescription>Create and manage tests</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        </div>
      </div>

      {/* Stats */}
      {userRole === 'student' && (
        <div className="mb-8">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-4">YOUR STATS</h2>
          <div className="grid grid-cols-4 gap-4">
            <StatCard icon={BookOpen} title="Completed" value="24" color="blue" />
            <StatCard icon={Trophy} title="Average Score" value="87%" color="green" />
            <StatCard icon={TrendingUp} title="Streak" value="7 days" color="orange" />
            <StatCard icon={GraduationCap} title="Rank" value="#12" color="purple" />
          </div>
        </div>
      )}

      {/* Available Quizzes */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-gray-700 dark:text-gray-300">
            {userRole === 'teacher' ? 'YOUR QUIZZES' : 'AVAILABLE QUIZZES'}
          </h2>
          <Button variant="link" className="text-blue-500">See All →</Button>
        </div>
        <div className="grid gap-4">
          <QuizCard title="JavaScript Fundamentals" questions={15} difficulty="Easy" time={20} />
          <QuizCard title="React Advanced Concepts" questions={20} difficulty="Medium" time={30} />
          <QuizCard title="Data Structures & Algorithms" questions={25} difficulty="Hard" time={45} />
          <QuizCard title="TypeScript Deep Dive" questions={18} difficulty="Medium" time={25} />
        </div>
      </div>
    </div>
  );
}

function TestsPage() {
  const [activeTab, setActiveTab] = useState('available');

  return (
    <div className="p-8 max-w-7xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Tests</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Browse and take tests</p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <Input placeholder="Search tests..." className="pl-10" />
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 mb-6">
        <Button
          variant={activeTab === 'available' ? 'default' : 'outline'}
          onClick={() => setActiveTab('available')}
        >
          Available Tests
        </Button>
        <Button
          variant={activeTab === 'completed' ? 'default' : 'outline'}
          onClick={() => setActiveTab('completed')}
        >
          Completed Tests
        </Button>
      </div>

      {/* Test List */}
      <div className="grid gap-4">
        {activeTab === 'available' ? (
          <>
            <TestCard title="JavaScript Fundamentals" questions={15} duration={20} />
            <TestCard title="React Advanced Concepts" questions={20} duration={30} />
            <TestCard title="CSS Grid & Flexbox" questions={12} duration={15} />
            <TestCard title="Node.js Basics" questions={18} duration={25} />
          </>
        ) : (
          <>
            <TestCard title="HTML5 Semantics" questions={10} duration={15} score={92} completed />
            <TestCard title="Git Version Control" questions={12} duration={20} score={88} completed />
            <TestCard title="REST API Design" questions={15} duration={25} score={85} completed />
          </>
        )}
      </div>
    </div>
  );
}

function CreateTestPage() {
  const [questions, setQuestions] = useState([]);

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Create Test</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Design your quiz for students</p>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Test Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Test Title</label>
              <Input placeholder="Enter test title..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Duration (minutes)</label>
                <Input type="number" placeholder="30" />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Pass Score (%)</label>
                <Input type="number" placeholder="70" />
              </div>
            </div>
          </CardContent>
        </Card>

        {questions.map((q, idx) => (
          <QuestionEditor key={q.id} index={idx} />
        ))}

        <Button
          variant="outline"
          className="w-full border-dashed border-2"
          onClick={() => setQuestions([...questions, { id: Date.now() }])}
        >
          <PlusCircle size={20} className="mr-2" />
          Add Question
        </Button>

        {questions.length > 0 && (
          <Button className="w-full" size="lg">
            Save Test
          </Button>
        )}
      </div>
    </div>
  );
}

function ProfilePage() {
  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">Profile</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account</p>
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-6">
            <div className="w-24 h-24 rounded-full bg-blue-500 flex items-center justify-center">
              <User size={40} className="text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">John Doe</h2>
              <p className="text-gray-600 dark:text-gray-400">john.doe@example.com</p>
              <span className="inline-block bg-blue-500 text-white px-3 py-1 rounded-full text-sm mt-2">
                Student
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <StatCard icon={BookOpen} title="Tests Taken" value="24" color="blue" />
        <StatCard icon={Trophy} title="Average Score" value="87%" color="green" />
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Button variant="outline" className="w-full justify-start">
            <User size={18} className="mr-2" />
            Edit Profile
          </Button>
          <Button variant="outline" className="w-full justify-start">
            <GraduationCap size={18} className="mr-2" />
            Preferences
          </Button>
          <Separator />
          <Button variant="destructive" className="w-full">
            Logout
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

// Helper Components
function StatCard({ icon: Icon, title, value, color }) {
  const colorClasses = {
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    orange: 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400',
    purple: 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400',
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-3 ${colorClasses[color]}`}>
          <Icon size={24} />
        </div>
        <div className="text-3xl font-bold text-gray-900 dark:text-white">{value}</div>
        <div className="text-sm text-gray-600 dark:text-gray-400">{title}</div>
      </CardContent>
    </Card>
  );
}

function QuizCard({ title, questions, difficulty, time }) {
  const difficultyColors = {
    Easy: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400',
    Medium: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400',
    Hard: 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400',
  };

  return (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
            <div className="flex items-center gap-4">
              <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                <BookOpen size={16} className="mr-1" />
                {questions} questions
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${difficultyColors[difficulty]}`}>
                {difficulty}
              </span>
            </div>
          </div>
          <div className="bg-blue-500 text-white px-4 py-2 rounded-full font-semibold">
            {time} min
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function TestCard({ title, questions, duration, score, completed }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{title}</h3>
            <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
              <span className="flex items-center">
                <BookOpen size={16} className="mr-1" />
                {questions} questions
              </span>
              <span>{duration} minutes</span>
            </div>
          </div>
          {completed && (
            <div className="bg-green-500 text-white px-4 py-2 rounded-full font-semibold">
              {score}%
            </div>
          )}
        </div>
        <div className="flex gap-2">
          {completed ? (
            <>
              <Button className="flex-1">Review Answers</Button>
              <Button variant="outline" className="flex-1">Retake</Button>
            </>
          ) : (
            <Button className="w-full">Start Test</Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

function QuestionEditor({ index }) {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Question {index + 1}</CardTitle>
          <Button variant="ghost" size="sm">
            <span className="text-red-500">Delete</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Question</label>
          <Input placeholder="Enter your question..." />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Options</label>
          <div className="space-y-2">
            {[1, 2, 3, 4].map((opt) => (
              <div key={opt} className="flex items-center gap-2">
                <input type="radio" name={`question-${index}`} className="w-4 h-4" />
                <Input placeholder={`Option ${opt}`} />
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
