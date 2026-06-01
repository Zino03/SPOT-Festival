import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import BuilderSetup from '../component/Builder/BuilderSetup/BuilderSetup'
import BuilderReport from '../component/Builder/BuilderReport/BuilderReport'
import BuilderTopBar from '../component/Builder/BuilderTopBar/BuilderTopBar'
import BuilderPath from '../component/Builder/BuilderPath/BuilderPath'
import BuilderHeader from '../component/Builder/BuilderHeader/BuilderHeader'
import BuilderStepper from '../component/Builder/BuilderStepper/BuilderStepper'
import BuilderStepHeader from '../component/Builder/BuilderStepHeader/BuilderStepHeader'
import BuilderCardGrid from '../component/Builder/BuilderCardGrid/BuilderCardGrid'
import BuilderNav from '../component/Builder/BuilderNav/BuilderNav'
import BuilderReceipt from '../component/Builder/BuilderReceipt/BuilderReceipt'
import './BuilderPage.css'

function BuilderPage() {
  const location = useLocation()
  const preselected = location.state?.preselectedFestival ?? null

  const [step, setStep] = useState(0)
  const [preferences, setPreferences] = useState({})
  const [selectedItems, setSelectedItems] = useState(
    preselected ? { 1: preselected } : {}
  )

  const selectedFestival = selectedItems[1]

  function handleSetupComplete(prefs) {
    setPreferences(prefs)
    // 축제 상세에서 넘어온 경우 Step 1 건너뛰고 Step 2로
    setStep(preselected ? 2 : 1)
  }

  function handleSelect(item) {
    setSelectedItems(prev => ({ ...prev, [step]: item }))
  }

  function handleNext() {
    if (step < 5) setStep(prev => prev + 1)
  }

  function handlePrev() {
    if (step > 1) setStep(prev => prev - 1)
  }

  function handleReset() {
    setStep(0)
    setPreferences({})
    setSelectedItems({})
  }

  // Step 0: 설정 화면
  if (step === 0) {
    return <BuilderSetup onComplete={handleSetupComplete} />
  }

  // Step 5: AI 리포트
  if (step === 5) {
    return (
      <BuilderReport
        selectedItems={selectedItems}
        preferences={preferences}
        onReset={handleReset}
      />
    )
  }

  return (
    <main className="builderpage">
      <BuilderTopBar currentStep={step} />
      <BuilderPath currentStep={step} />
      <BuilderHeader />
      <BuilderStepper currentStep={step} selectedItems={selectedItems} />
      <div className="builderpage_content">
        <div className="builderpage_main">
          <BuilderStepHeader
            currentStep={step}
            totalCount={null}
          />
          <BuilderCardGrid
            currentStep={step}
            festival={selectedFestival}
            onSelect={handleSelect}
          />
          <BuilderNav
            currentStep={step}
            selectedItem={selectedItems[step]}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
        <BuilderReceipt
          currentStep={step}
          selectedItems={selectedItems}
        />
      </div>
    </main>
  )
}

export default BuilderPage
