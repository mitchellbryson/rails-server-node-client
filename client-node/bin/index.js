#!/usr/bin/env node

const yargs = require('yargs')
const inquirer = require('inquirer')

const issue = {
  id: {
    message: 'Id?',
    name: 'id',
    type: 'string',
  },
  name: {
    message: 'Name?',
    name: 'name',
    type: 'string',
  },
  description: {
    message: 'Description?',
    name: 'description',
    type: 'string',
  },
}

const prompt = async (attributes) => await inquirer.prompt(attributes)

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

const create = async () => {
  const attributes = await prompt([issue.name, issue.description])

  console.log('Issue created: ', attributes)
}

const show = async () => {
  const attributes = await prompt([issue.id])

  console.log('Issue: ', attributes)
}

const update = async () => {
  const attributes = await prompt([issue.id, issue.name, issue.description])

  if (await confirm('Are you sure you want to update this issue?')) {
    console.log('Issue updated: ', attributes)
  } else {
    console.log('Cancelled update.')
  }
}

const destroy = async () => {
  const attributes = await prompt([issue.id])

  if (await confirm('Are you sure you want to destroy this issue?')) {
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
