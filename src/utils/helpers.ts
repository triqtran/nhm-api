interface IHelpers {
  getDateString(date: Date): string;
  getTimeString(date: Date): string;
}

class Helpers implements IHelpers {
  getDateString(date: Date): string {
    return new Date(date).toLocaleDateString();
  }

  getTimeString(date: Date): string {
    const time = new Date(date).toLocaleTimeString();
    return `${time.slice(0, -3)} GMT+0700`;
  }
}

export default new Helpers();
