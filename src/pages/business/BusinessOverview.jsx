import { Navbar } from '../../components'
import PageHeader from '../../components/PageHeader'
import BusinessArchitecture from '../../components/images/BusinessArchitecture'

export default function BusinessOverview() {
	const coreItems = [
		{ label: 'Capabilities', angle: -90 },
		{ label: 'Value Streams', angle: 0 },
		{ label: 'Organization', angle: 90 },
		{ label: 'Information', angle: 180 },
	]

	const supportingItems = [
		{ label: 'Stakeholders', angle: 300 },
		{ label: 'Policies', angle: 0 },
		{ label: 'Strategy', angle: 60 },
		{ label: 'Projects', angle: 120 },
		{ label: 'KPIs', angle: 180 },
		{ label: 'Services', angle: 240 },
	]

	function polarPosition(angleDeg, radiusPct) {
		const rad = (angleDeg * Math.PI) / 180
		const x = 50 + radiusPct * Math.cos(rad)
		const y = 50 + radiusPct * Math.sin(rad)
		return { left: `${x}%`, top: `${y}%` }
	}

	function labelStyle(angleDeg, radiusPct) {
		const base = polarPosition(angleDeg, radiusPct)
		// Right side
		if (angleDeg > -45 && angleDeg <= 45) {
			return { ...base, transform: 'translate(0, -50%)', textAlign: 'left' }
		}
		// Left side
		if (angleDeg > 135 || angleDeg <= -135) {
			return { ...base, transform: 'translate(-100%, -50%)', textAlign: 'right' }
		}
		// Top/Bottom
		return { ...base, transform: 'translate(-50%, -50%)', textAlign: 'center' }
	}

	return (

		<>
			<PageHeader title="Business Overview" />
			
				
				
				{/* Right Column */}
				<div className="flex items-center justify-center">
					<div className="w-full max-w-xl h-full flex items-center justify-center">
						<BusinessArchitecture />
					</div>
				</div>
			
		</>
			
		
	)
}


