import { useState, useEffect } from "react";

const STORAGE_KEY = "lab_sgg_walkthrough_completed_v1";

export function useWalkthrough(totalSteps: number) {
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [hasCompleted, setHasCompleted] = useState<boolean>(false);

  useEffect(() => {
    const isCompleted = localStorage.getItem(STORAGE_KEY) === "true";
    setHasCompleted(isCompleted);
    
    if (!isCompleted) {
      setIsOpen(true);
    }
  }, []);

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep((prev) => prev + 1);
    } else {
      completeWalkthrough();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const completeWalkthrough = () => {
    localStorage.setItem(STORAGE_KEY, "true");
    setHasCompleted(true);
    setIsOpen(false);
    setCurrentStep(0);
  };

  const reopenWalkthrough = () => {
    setCurrentStep(0);
    setIsOpen(true);
  };

  return {
    isOpen,
    currentStep,
    hasCompleted,
    nextStep,
    prevStep,
    completeWalkthrough,
    reopenWalkthrough,
  };
}