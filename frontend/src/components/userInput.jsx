"use client";
import {
  Autocomplete,
  AutocompleteItem,
  Button,
  CircularProgress,
  NumberInput,
  Textarea,
} from "@heroui/react";
import { useState } from "react";

export const UserInputSide = ({ onSubmit, loading, statusMessage }) => {
  const [type, setType] = useState("");
  const [text, setText] = useState("");
  const [number, setNumber] = useState(10);
  const [ErrorType, setErrorType] = useState("");
  const [ErrorText, setErrorText] = useState("");
  const [ErrorNumber, setErrorNumber] = useState("");

  const handleTypeChange = (val) => {
    setType(val);
    setErrorType("");
  };
  const handleTextChange = (e) => {
    setText(e.target.value);
    setErrorText("");
  };
  const handleNumberChange = (val) => {
    const num = typeof val === "string" ? parseInt(val, 10) : val;
    setNumber(num);
    setErrorNumber("");
  };

  const validateNumber = () => {
    let valid = true;
    if (!type || type.trim() === "") {
      setErrorType("Please Select a type.");
      valid = false;
    }
    if (!text || text.trim() === "") {
      setErrorText("Invalid input. Please Enter valid text.");
      valid = false;
    }
    if (
      Number.isNaN(number) ||
      number < 1 ||
      !Number.isInteger(number) ||
      number === null ||
      number === undefined
    ) {
      setErrorNumber("Invalid input. Please Enter a valid number.");
      valid = false;
    }
    if (valid) {
      onSubmit(type, number, text);
    }
  };

  return (
    <div className="w-full p-8 h-full col-span-1 flex flex-col">
      <div className="flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-2 text-center">
          Question Generator
        </h1>
        <p className="text-gray-500 mb-6 text-center">
          Generate an article and corresponding questions
        </p>
      </div>
      <div className="overflow-visible py-2 ">
        {/* TYPE */}
        <div className="mb-6">
          <label
            htmlFor="user-selectionType"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Type:
          </label>
          <Autocomplete
            id="user-selectionType"
            className="max-w-xs"
            variant="bordered"
            aria-label="Type selection"
            onSelectionChange={handleTypeChange}
            placeholder="Select Type"
            defaultInputValue={type}
            isInvalid={!!ErrorType}
            errorMessage={ErrorType}
          >
            <AutocompleteItem key="topic" value="topic">
              Topic
            </AutocompleteItem>
            <AutocompleteItem key="paragraph" value="paragraph">
              Paragraph
            </AutocompleteItem>
          </Autocomplete>
        </div>

        {/* Difficulty */}
        <label
          htmlFor="user-Difficulty"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          No. of Questions of Each Difficulty:
        </label>
        <div className="flex space-x-4">
          <div className="mb-6">
            <label
              htmlFor="user-easyQuestion"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Easy:
            </label>
            <NumberInput
              id="user-easyQuestion"
              className="max-w-xs"
              variant="bordered"
              aria-label="Number of questions"
              onChange={handleNumberChange}
              defaultValue={number}
              minValue={1}
              maxValue={500}
              isInvalid={!!ErrorNumber}
              errorMessage={ErrorNumber}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="user-mediumQuestion"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Medium :
            </label>
            <NumberInput
              id="user-mediumQuestion"
              className="max-w-xs"
              variant="bordered"
              aria-label="Number of questions"
              defaultValue={10}
              minValue={1}
              maxValue={500}
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="user-HardQuestion"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Hard :
            </label>
            <NumberInput
              id="user-HardQuestion"
              className="max-w-xs"
              variant="bordered"
              aria-label="Number of questions"
              defaultValue={10}
              minValue={1}
              maxValue={500}
            />
          </div>
        </div>

        {/* TEXTAREA */}
        <div className="mb-6">
          <label
            htmlFor="user-textarea"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter Text here:
          </label>
          <Textarea
            id="user-textarea"
            disableAutosize
            disableAnimation
            onChange={handleTextChange}
            value={text}
            classNames={{
              input: "resize-y min-h-[350px] max-h-[400px]",
            }}
            radius="sm"
            color="secondary"
            variant="bordered"
            isInvalid={!!ErrorText}
            errorMessage={ErrorText}
          />
        </div>

        {statusMessage && (
          <div className="text-red-500 text-center mb-4">{statusMessage}</div>
        )}

        <div className="flex justify-center mb-6">
          <Button
            id="generate-button"
            variant="solid"
            color="primary"
            size="lg"
            spinnerPlacement="end"
            onPress={validateNumber}
            spinner={
              <CircularProgress
                aria-label="Loading..."
                color="secondary"
                size="sm"
                isIndeterminate={true}
              />
            }
            isLoading={loading}
            radius="md"
            className="font-semibold focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            <span id="button-text">Generate Content</span>
          </Button>
        </div>
      </div>
    </div>
  );
};
