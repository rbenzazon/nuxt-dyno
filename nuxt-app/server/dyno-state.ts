class DynoState {
  private static instance: DynoState;

  // Add your utility properties and methods here
  public rpm: number = 0;
  public started:boolean = false;
  public powerHp:number = 0;
  public torqueFtLbs:number = 0;
  public afr:number = 0;
  public intakeTempC:number = 0;
  public throttlePosPerc:number = 0;
  public boostPsi:number = 0;
  public waterTempC:number = 0;
  public oilTempC:number = 0;
  public oilPressurePsi:number = 0;

  private constructor() {}

  static getInstance(): DynoState {
    if (!DynoState.instance) {
      DynoState.instance = new DynoState();
    }
    return DynoState.instance;
  }

  // Example method
  public log(message: string) {
    // You can enhance this for server-side logging
    console.log('[DynoState]', message);
  }
}

export default DynoState;
