import jobs from '../data/jobs.json'
import applications from '../data/applications.json'

describe('Static data', () => {
  test('jobs.json has at least 1 job', () => {
    expect(Array.isArray(jobs)).toBe(true)
    expect(jobs.length).toBeGreaterThan(0)
  })

  test('applications.json has at least 1 application', () => {
    expect(Array.isArray(applications)).toBe(true)
    expect(applications.length).toBeGreaterThan(0)
  })
})
