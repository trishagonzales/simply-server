interface GuardResult {
  isSuccess: boolean;
  message: string;
}

export class Guard {
  public static nullOrUndefined(value: any): GuardResult {
    if (value === undefined || value === null) {
      return { isSuccess: false, message: `${value} is null or undefined` };
    } else {
      return { isSuccess: true, message: '' };
    }
  }

  public static nullOrUndefinedList(values: any[]): GuardResult {
    for (let val of values) {
      const res = this.nullOrUndefined(val);
      if (!res.isSuccess) return res;
    }

    return { isSuccess: true, message: '' };
  }
}
