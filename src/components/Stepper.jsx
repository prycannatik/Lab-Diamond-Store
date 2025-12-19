// src/components/Stepper.jsx
import React, { useState, Children, useRef, useLayoutEffect, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { LiquidButton } from './Icons'; // Importing your liquid buttons

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  stepCircleContainerClassName = '',
  stepContainerClassName = '',
  contentClassName = '',
  footerClassName = '',
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Back',
  nextButtonText = 'Continue',
  disableStepIndicators = false,
  renderStepIndicator,
  forceStep,
  beforeStepChange,
  ...rest
}) {
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [direction, setDirection] = useState(0);
  const stepsArray = Children.toArray(children);
  const totalSteps = stepsArray.length;
  const isCompleted = currentStep > totalSteps;
  const isLastStep = currentStep === totalSteps;

  useEffect(() => {
    if (forceStep !== undefined && forceStep !== currentStep) {
        setDirection(forceStep > currentStep ? 1 : -1);
        setCurrentStep(forceStep);
    }
  }, [forceStep]);

  const updateStep = async (newStep) => {
    if (newStep > currentStep && beforeStepChange) {
        const canProceed = await beforeStepChange(currentStep);
        if (!canProceed) return;
    }
    setDirection(newStep > currentStep ? 1 : -1);
    setCurrentStep(newStep);
    if (newStep > totalSteps) onFinalStepCompleted();
    else onStepChange(newStep);
  };

  const handleBack = () => {
    if (currentStep > 1) updateStep(currentStep - 1);
  };

  const handleNext = () => {
    if (!isLastStep) updateStep(currentStep + 1);
  };

  const handleComplete = () => {
    updateStep(totalSteps + 1);
  };

  return (
    <div className="flex flex-1 flex-col" {...rest}>
      <div className={`mx-auto w-full ${stepCircleContainerClassName}`}>
        <div className={`${stepContainerClassName} flex w-full items-center p-4 mb-2`}>
          {stepsArray.map((_, index) => {
            const stepNumber = index + 1;
            const isNotLastStep = index < totalSteps - 1;
            return (
              <React.Fragment key={stepNumber}>
                <StepIndicator
                    step={stepNumber}
                    disableStepIndicators={disableStepIndicators || stepNumber > currentStep}
                    currentStep={currentStep}
                    onClickStep={(clicked) => { if (clicked < currentStep) updateStep(clicked); }}
                />
                {isNotLastStep && <StepConnector isComplete={currentStep > stepNumber} />}
              </React.Fragment>
            );
          })}
        </div>
        
        <StepContentWrapper
          isCompleted={isCompleted}
          currentStep={currentStep}
          direction={direction}
          className={`space-y-2 ${contentClassName}`}
        >
          {stepsArray[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <div className={`px-4 pb-4 ${footerClassName}`}>
            <div className={`mt-4 flex items-center ${currentStep !== 1 ? 'justify-between' : 'justify-end'}`}>
              {currentStep !== 1 && (
                <LiquidButton
                  onClick={handleBack}
                  label={backButtonText}
                  size="small"
                  className="!bg-slate-800/50 !border-white/5"
                  {...backButtonProps}
                />
              )}
              <LiquidButton
                onClick={isLastStep ? handleComplete : handleNext}
                label={isLastStep ? 'Place Order' : nextButtonText}
                variant="primary"
                size="small"
                {...nextButtonProps}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StepContentWrapper({ isCompleted, currentStep, direction, children, className }) {
  const [parentHeight, setParentHeight] = useState('auto');
  return (
    <motion.div
      style={{ position: 'relative', overflow: 'hidden' }}
      animate={{ height: isCompleted ? 0 : parentHeight }}
      transition={{ type: 'spring', duration: 0.4 }}
      className={className}
    >
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        {!isCompleted && (
          <SlideTransition key={currentStep} direction={direction} onHeightReady={(h) => setParentHeight(h)}>
            {children}
          </SlideTransition>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function SlideTransition({ children, direction, onHeightReady }) {
  const containerRef = useRef(null);
  useLayoutEffect(() => {
    if (containerRef.current) onHeightReady(containerRef.current.offsetHeight);
  }, [children, onHeightReady]);

  return (
    <motion.div
      ref={containerRef}
      custom={direction}
      variants={{
        enter: (dir) => ({ x: dir >= 0 ? '20%' : '-20%', opacity: 0 }),
        center: { x: '0%', opacity: 1 },
        exit: (dir) => ({ x: dir >= 0 ? '-20%' : '20%', opacity: 0 }),
      }}
      initial="enter"
      animate="center"
      exit="exit"
      transition={{ duration: 0.3 }}
      style={{ width: '100%' }}
    >
      {children}
    </motion.div>
  );
}

export function Step({ children }) {
  return <div className="px-1">{children}</div>;
}

function StepIndicator({ step, currentStep, onClickStep, disableStepIndicators }) {
  const status = currentStep === step ? 'active' : currentStep < step ? 'inactive' : 'complete';
  const handleClick = () => { if (step !== currentStep && !disableStepIndicators) onClickStep(step); };

  return (
    <motion.div onClick={handleClick} className="relative cursor-pointer outline-none focus:outline-none z-10" animate={status} initial={false}>
      <motion.div
        variants={{
          inactive: { scale: 1, backgroundColor: 'rgba(255,255,255,0.05)', color: '#94a3b8', border: '1px solid rgba(255,255,255,0.05)' },
          active: { scale: 1, backgroundColor: '#3b82f6', color: '#ffffff', border: '1px solid rgba(59,130,246,0.5)', boxShadow: '0 0 15px rgba(59,130,246,0.5)' },
          complete: { scale: 1, backgroundColor: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: '1px solid rgba(59,130,246,0.3)' },
        }}
        transition={{ duration: 0.3 }}
        className="flex h-6 w-6 items-center justify-center rounded-full text-[10px] font-semibold backdrop-blur-md"
      >
        {status === 'complete' ? <CheckIcon className="h-3.5 w-3.5" /> : <span>{step}</span>}
      </motion.div>
    </motion.div>
  );
}

function StepConnector({ isComplete }) {
  return (
    <div className="relative mx-1 h-0.5 flex-1 overflow-hidden rounded bg-slate-700/50">
      <motion.div
        className="absolute left-0 top-0 h-full"
        variants={{ incomplete: { width: 0, backgroundColor: 'transparent' }, complete: { width: '100%', backgroundColor: '#3b82f6' } }}
        initial={false}
        animate={isComplete ? 'complete' : 'incomplete'}
        transition={{ duration: 0.4 }}
      />
    </div>
  );
}

function CheckIcon(props) {
  return (
    <svg {...props} fill="none" stroke="currentColor" strokeWidth={3} viewBox="0 0 24 24">
      <motion.path initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 0.1, duration: 0.3 }} strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
  );
}