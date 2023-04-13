import { useState } from "react";
import {
  Box,
  IconButton,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverArrow,
  PopoverCloseButton,
  PopoverFooter,
  Button,
  PopoverHeader,
  PopoverBody,
} from "@chakra-ui/react";
import { FiBell } from "react-icons/fi";

const NotificationBell = () => {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  // function to handle the event when the chef accepts the order
  function handleOrderAccept() {
    setIsPopoverOpen(true);
  }

  // function to close the popover
  function handleClosePopover() {
    setIsPopoverOpen(false);
  }

  return (
    <Box
      position="relative"
      display="inline-block"
      mr="12"
      width="40px"
      height="40px"
    >
      <Popover
        isOpen={isPopoverOpen}
        onClose={handleClosePopover}
        placement="bottom-end"
      >
        <PopoverTrigger>
          <IconButton
            aria-label="Bell"
            icon={<FiBell />}
            borderRadius="full"
            onClick={() => {
              handleOrderAccept();
            }}
          />
        </PopoverTrigger>
        <PopoverContent>
          <PopoverArrow />
          <PopoverHeader>Header</PopoverHeader>
          <PopoverCloseButton />
          <PopoverBody>
            <Button colorScheme="blue">Button</Button>
          </PopoverBody>
          <PopoverFooter>Your order is accepted.</PopoverFooter>
        </PopoverContent>
      </Popover>
    </Box>
  );
};

export default NotificationBell;
