import { Task } from '@prisma/client'
import { GetServerSideProps } from 'next'
import { signOut } from 'next-auth/react'
import React, { FormEvent, useState } from 'react'
import { prisma } from '../../lib/prisma'

type TaskProps = {
  tasks: Task[]
}

export const getServerSideProps: GetServerSideProps = async () => {
  const tasks = await prisma.task.findMany()

  const data = tasks.map((task) => {
    return {
      id: task.id,
      title: task.title,
      isDone: task.isDone,
      date: task.createdAt.toISOString(),
    }
  })
  return {
    props: {
      tasks: data,
    },
  }
}

export default function App({ tasks }: TaskProps) {
  const [newTask, setNewTask] = useState('')

  async function handleCreateTask(event: FormEvent) {
    event.preventDefault()

    await fetch('http://localhost:3000/api/tasks/create', {
      method: 'POST',
      body: JSON.stringify({ title: newTask }),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  return (
    <div>
      <h1>Hello, World!</h1>
      <pre>{JSON.stringify(tasks, null, 2)}</pre>

      <ul>
        {tasks.map((task) => (
          <li key={task.id}>{task.title}</li>
        ))}
      </ul>

      <form onSubmit={handleCreateTask}>
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
        />
        <button type="submit">Cadastrar</button>
      </form>

      <button
        onClick={() => signOut({ callbackUrl: 'http://localhost:3000/' })}
      >
        Sair
      </button>
    </div>
  )
}
