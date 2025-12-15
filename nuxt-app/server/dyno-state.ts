import { maxLoadlbft } from '~~/shared/dyno';

class DynoState {
	private static instance: DynoState;

	public loadlbft: number = 0;
	public maxLoadlbft: number = maxLoadlbft;
	public loadCellLbs: number = 0;
	public isFanOn: boolean = false;
	public isCapturing: boolean = false;
	public capturedData: Array<any> = [];
	public currentRunId: string = '';
	public ambientTempC: number = 0;
	public ambientHumidityPerc: number = 0;
	public ambientPressurePsi: number = 0;
	public targetCaptureRpm: number = 0;
	public targetMaxRpm: number = 0;
	public runInProgress: boolean = false;
	public runStartTime: Date | null = null;
	public runEndTime: Date | null = null;
	public runDurationSeconds: number = 0;
	public peakPowerHp: number = 0;
	public peakTorqueFtLbs: number = 0;
	public notes: string = '';
	public operatorName: string = '';
	public vehicleInfo: string = '';
	public emergencyStopEngaged: boolean = false;
	public location: string = '';
	public owner: string = '';

	private constructor() {}

	static getInstance(): DynoState {
		if (!DynoState.instance) {
			DynoState.instance = new DynoState();
		}
		return DynoState.instance;
	}
}

export default DynoState;
