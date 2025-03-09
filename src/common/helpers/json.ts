export function safetyJSONParse<TReturn>(value?: string | null): TReturn | undefined {
  if (!value) {
    return undefined
  }

  try {
    return JSON.parse(value) as TReturn
  } catch {
    return undefined
  }
}

export function safetyAtoB(value?: string | null): string | undefined {
  if (!value) {
    return undefined
  }

  try {
    return atob(value)
  } catch {
    return undefined
  }
}

export function getObjectValue<Result = any, ObjectParam = any>(
  objectParam: ObjectParam,
  path: string,
): Result {
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.')

  return keys.reduce((acc: ObjectParam | undefined, key) => {
    if (acc && Object.prototype.hasOwnProperty.call(acc, key)) {
      return acc[key as keyof ObjectParam] as ObjectParam
    }
    return undefined
  }, objectParam) as Result
}
