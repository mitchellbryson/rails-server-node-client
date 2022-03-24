#!/usr/bin/env node

const yargs = require('yargs')
const inquirer = require('inquirer')
const axios = require('axios')

const apiUrl = 'http://localhost:3000'

const issue = {
  id: {
    message: 'Id?',
    name: 'id',
    type: 'string',
  },
  name: {
    message: 'Title?',
    name: 'title',
    type: 'string',
  },
  description: {
    message: 'Description?',
    name: 'description',
    type: 'string',
  },
}

const prompt = (attributes) => inquirer.prompt(attributes)

const confirm = async (message) => {
  const { confirm } = await inquirer.prompt([
    {
      message,
      name: 'confirm',
      type: 'confirm',
    },
  ])

  return confirm
}

const api = async (path, method = 'get', data = null) => {
  try {
    const response = await axios({
      method,
      data,
      headers: { Accept: 'application/json' },
      url: `${apiUrl}/${path}`,
      responseType: 'json',
    })

    return response.data
  } catch (error) {
    console.log(error.response.statusText)

    return false
  }
}

const create = async () => {
  const attributes = await prompt([issue.name, issue.description])

  const result = await api('issues', 'post', { issue: attributes })

  if (result) console.log('Issue created: ', result)
}

const show = async () => {
  const attributes = await prompt([issue.id])

  if (attributes.id) {
    const result = await api(`issues/${attributes.id}`)

    if (result) console.log('Issue: ', result)
  }
}

const update = async () => {
  const attributes = await prompt([issue.id, issue.name, issue.description])

  const result = await api(`issues/${attributes.id}`, 'patch', {
    issue: attributes,
  })

  if (
    result &&
    (await confirm('Are you sure you want to update this issue?'))
  ) {
    console.log('Issue updated: ', result)
  } else {
    console.log('Cancelled update.')
  }
}

const destroy = async () => {
  const attributes = await prompt([issue.id])

  if (await confirm('Are you sure you want to destroy this issue?')) {
    const result = await api(`issues/${attributes.id}`, 'delete')
    console.log('Issue destroyed.')
  } else {
    console.log('Cancelled destroy.')
  }
}

const options = yargs
  .usage('Usage: <command>')
  .command('create', 'Create an issue', () => {}, create)
  .command('show', 'Show an issue', () => {}, show)
  .command('update', 'Update an issue', () => {}, update)
  .command('destroy', 'Destroy an issue', () => {}, destroy)
  .demandCommand(1, 1, 'Choose a command: create, show, update, destroy').argv
