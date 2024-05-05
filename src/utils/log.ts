type LogLevel = "debug" | "info" | "warn" | "error"

export const log = {
	info: (...msg: any) => printLog(msg, "info"),
	debug: (...msg: any) => printLog(msg, "debug"),
	warn: (...msg: any) => printLog(msg, "warn"),
	error: (...msg: any) => printLog(msg, "error"),
}

export const printLog = (msg: unknown, level: LogLevel) => {
	let color = "white"

	if (level === "debug") color = "#888"
	else if (level === "warn") color = "yellow"
	else if (level === "error") color = "#f88"

	console.log(`<p style='color:${color}'>${msg}</p>`)
}
