import { isTaskResolved, updateTask, updateTasks } from '.'

describe('updateTask', () => {
  it('should update task', () => {
    expect(
      updateTask(
        {
          tasks: {
            task1: { loading: false },
            task2: { loading: true },
          },
        },
        'task2',
        { data: { name: 'User' }, loading: false },
      ),
    ).toStrictEqual({
      tasks: {
        task1: { loading: false },
        task2: { data: { name: 'User' }, loading: false },
      },
    })
  })
})

describe('updateTasks', () => {
  it('should update tasks', () => {
    expect(
      updateTasks(
        {
          tasks: {
            task1: { loading: true },
            task2: { loading: false },
            task3: { loading: false },
          },
        },
        [
          ['task1', { loading: false }],
          ['task2', { data: { name: 'User' } }],
        ],
      ),
    ).toStrictEqual({
      tasks: {
        task1: { loading: false },
        task2: { data: { name: 'User' }, loading: false },
        task3: { loading: false },
      },
    })
  })
})

describe('isTaskResolved', () => {
  it('should resolve task', () => {
    const previousTask = { loading: true }
    const currentTask = { loading: false }
    expect(isTaskResolved(currentTask, previousTask)).toStrictEqual(true)
  })

  it('should not resolve task when error occurs', () => {
    const previousTask = { loading: true }
    const currentTask = { loading: false, error: {} as Error }
    expect(isTaskResolved(currentTask, previousTask)).toStrictEqual(false)
  })

  it('should not resolve task when task still in loading state', () => {
    const previousTask = { loading: true }
    const currentTask = { loading: true }
    expect(isTaskResolved(currentTask, previousTask)).toStrictEqual(false)
  })
})
