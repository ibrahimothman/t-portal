import DigitalStrategyImage from '../../components/images/DigitalStrategyImage'
import PageHeader from '../../components/PageHeader'

export default function DigitalStrategyOverview() {
	return (
		<div className="min-h-screen bg-white">
			<PageHeader title="Digital Strategy Overview" />



			<section>
				<div className="w-full mx-auto text-center mt-6 px-4">
					<div className="max-w-none">
						<DigitalStrategyImage />
					</div>
				</div>
			</section>

			
		</div>
	)
}


