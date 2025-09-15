import { useNavigate } from 'react-router-dom'

export default function DigitalStrategyImage() {
	const navigate = useNavigate()

	return (
		<svg 
			style={{ width: '100%', height: 'auto', maxHeight: '200vh' }} 
			xmlns="http://www.w3.org/2000/svg" 
			viewBox="0 0 1280 720"
		>
            <style>
                {`
                .image-mapper-shape {
                    fill: rgba(0, 0, 0, 0);
                    transition: all 0.2s ease-in-out;
                }
                g:hover .image-mapper-shape {
                    stroke: #4f46e5;
                    stroke-width: 4px;
                    opacity: 100%;
                }
                `}
            </style>
        
            <image href="/images/digital-strategy-2.svg" x="0" y="0" width="1280" height="720" preserveAspectRatio="xMidYMid meet" />
            <g onClick={() => navigate('/strategy/specialized-strategies')}>
            <rect x="185.3968253968254" y="335.23809523809524" width="999.3650793650794" height="66.03174603174608" className="image-mapper-shape" data-index="4"></rect>
            </g>
            <g onClick={() => navigate('/strategy/projects-portfolio')}>
            <rect x="281.9047619047619" y="604.4444444444445" width="233.65079365079362" height="66.03174603174602" className="image-mapper-shape" data-index="5"></rect>
            </g>

            </svg>

  )
}
