export const getError = (code: number) => {
	switch (code) {
		case OK:
			return "OK" // 0
		case ERR_NOT_OWNER:
			return "NOT_OWNER" // -1
		case ERR_NO_PATH:
			return "NO_PATH" // -2
		case ERR_NAME_EXISTS:
			return "NAME_EXISTS" // -3
		case ERR_BUSY:
			return "BUSY" // -4
		case ERR_NOT_FOUND:
			return "NOT_FOUND" // -5
		case ERR_NOT_ENOUGH_ENERGY:
			return "NOT_ENOUGH_RESOURCES" // -6
		case ERR_INVALID_TARGET:
			return "INVALID_TARGET" // -7
		case ERR_FULL:
			return "FULL" // -8
		case ERR_NOT_IN_RANGE:
			return "NOT_IN_RANGE" // -9
		case ERR_INVALID_ARGS:
			return "INVALID_ARGS" // -10
		case ERR_TIRED:
			return "TIRED" // -11
		case ERR_NO_BODYPART:
			return "NO_BODYPART" // -12
		case ERR_RCL_NOT_ENOUGH:
			return "RCL_NOT_ENOUGH" // -14
		case ERR_GCL_NOT_ENOUGH:
			return "GCL_NOT_ENOUGH" // -15
		default:
			return "UNKNOWN_ERROR"
	}
}
