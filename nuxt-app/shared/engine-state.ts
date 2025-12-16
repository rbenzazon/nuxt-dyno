class EngineState {
	private static instance: EngineState;

	public rpm: number = 0;
	public started: boolean = false;
	public powerHp: number = 0;
	public torqueFtLbs: number = 0;
	public afr: number = 0;
	public intakeTempC: number = 0;
	public throttlePosPerc: number = 0;
	public boostPsi: number = 0;
	public waterTempC: number = 0;
	public oilTempC: number = 0;
	public oilPressurePsi: number = 0;

	private constructor() {}

	static getInstance(): EngineState {
		if (!EngineState.instance) {
			EngineState.instance = new EngineState();
		}
		return EngineState.instance;
	}
}

export default EngineState;
