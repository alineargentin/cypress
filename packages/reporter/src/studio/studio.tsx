import { observer } from 'mobx-react'
import React, { Component, MouseEvent } from 'react'
// @ts-ignore
import Tooltip from '@cypress/react-tooltip'

import events, { Events } from '../lib/events'
import appState, { AppState } from '../lib/app-state'
import runnablesStore, { RunnablesStore } from '../runnables/runnables-store'
import TestModel from '../test/test-model'

import scroller, { Scroller } from '../lib/scroller'
import Attempts from '../attempts/attempts'
import StudioCommandModel from './studio-command-model'

const StudioHeader = observer(({ model }: { model: TestModel }) => (
  <div className='runnable-wrapper'>
    <div className='studio-header'>
      <i aria-hidden='true' className='runnable-state fas' />
      <span className='runnable-title'>
        <span>{model.title}</span>
        <span className='visually-hidden'>{model.state}</span>
      </span>
      <span className='runnable-controls'>
        <Tooltip placement='top' title='One or more commands failed' className='cy-tooltip'>
          <i className='fas fa-exclamation-triangle runnable-controls-status' />
        </Tooltip>
      </span>
    </div>
  </div>
))

const StudioNoCommands = () => (
  <li className='studio-command studio-no-commands'>
    <span className='studio-no-commands-message'>Interact with your site to add test commands.</span>
    <span><i className='fa fa-long-arrow-alt-right' /></span>
  </li>
)

interface StudioCommandProps {
  events: Events
  model: StudioCommandModel
  index: number
}

@observer
class StudioCommand extends Component<StudioCommandProps> {
  static defaultProps = {
    events,
  }

  remove = (e: MouseEvent) => {
    e.preventDefault()

    const { events, index } = this.props

    events.emit('studio:remove:command', index)
  }

  render () {
    const { model, index } = this.props

    return (
      <li className='studio-command'>
        <div className='studio-command-number'>
          {index + 1}
        </div>
        <div className='studio-command-method'>
          <span className='studio-command-get'>get</span>
          <br/>
          - {model.command}
        </div>
        <div className='studio-command-message'>
          <span>{model.selector}</span>
          <br/>
          <span>{model.value}</span>
        </div>
        <div className='studio-command-delete'>
          <a href='#' onClick={this.remove}><i className='far fa-times-circle'/></a>
        </div>
      </li>
    )
  }
}

interface StudioProps {
  events: Events
  appState: AppState
  runnablesStore: RunnablesStore
  scroller: Scroller
  model: TestModel
}

@observer
class Studio extends Component<StudioProps> {
  static defaultProps = {
    events,
    appState,
    runnablesStore,
    scroller,
  }

  render () {
    const { model } = this.props

    return (
      <div className='wrap'>
        <div className='runnables'>
          <div className={`studio runnable runnable-${model.state}`}>
            <StudioHeader model={model} />
            <div className='runnable-instruments'>
              <Attempts test={model} scrollIntoView={() => {}} />
              <ul className='studio-commands-container'>
                {!model.studioCommands.length && model.state === 'passed' && <StudioNoCommands />}
                {model.studioCommands.map((command, index) => <StudioCommand key={command.id} index={index} model={command} />)}
              </ul>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default Studio