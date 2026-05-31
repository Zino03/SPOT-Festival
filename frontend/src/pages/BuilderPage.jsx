import { useState } from 'react'
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
  const [currentStep, setCurrentStep]     = useState(1)
  const [selectedItems, setSelectedItems] = useState({})

  function handleSelect(item) {
    setSelectedItems(prev => ({ ...prev, [currentStep]: item }))
  }

  function handleNext() {
    if (currentStep < 5) setCurrentStep(prev => prev + 1)
  }

  function handlePrev() {
    if (currentStep > 1) setCurrentStep(prev => prev - 1)
  }

  return (
    <main className="builderpage">
      <BuilderTopBar currentStep={currentStep} />
      <BuilderPath currentStep={currentStep} />
      <BuilderHeader />
      <BuilderStepper currentStep={currentStep} selectedItems={selectedItems} />
      <div className="builderpage_content">
        <div className="builderpage_main">
          <BuilderStepHeader
            currentStep={currentStep}
            totalCount={22}
          />
          <BuilderCardGrid
            currentStep={currentStep}
            onSelect={handleSelect}
          />
          <BuilderNav
            currentStep={currentStep}
            selectedItem={selectedItems[currentStep]}
            onPrev={handlePrev}
            onNext={handleNext}
          />
        </div>
        <BuilderReceipt
          currentStep={currentStep}
          selectedItems={selectedItems}
        />
      </div>
    </main>
  )
}

export default BuilderPage