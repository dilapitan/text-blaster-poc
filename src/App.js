import React, { useState } from 'react';
import {
  Box,
  Button,
  ChakraProvider,
  Container,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Heading,
  Textarea,
  Text,
  Grid,
  theme,
  useToast,
} from '@chakra-ui/react';
import { MdSend } from 'react-icons/md';
import { ColorModeSwitcher } from './ColorModeSwitcher';

import { sendSMS } from './services/SendSmsService';

function App() {
  const MAX_CHARACTER_COUNT = 160;
  const MAX_NUMBER_OF_RECIPIENTS = 3;
  const [announcement, setAnnouncement] = useState('');
  const [recipients, setRecipients] = useState('');
  const [isAnnouncementError, setIsAnnouncementError] = useState(false);
  const [isRecipientError, setIsRecipientError] = useState(false);
  const [isInvalidRecipients, setIsInvalidRecipients] = useState(false);
  const [isInvalidNumberOfRecipients, setIsInvalidNumberOfRecipients] =
    useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  function isValidRecipient(recipient) {
    const SIMPLE_CELLNUMBER_PATTERN = /^09[0-9]{9}$/g;
    return recipient.match(SIMPLE_CELLNUMBER_PATTERN);
  }

  function isValidRecipients(recipients) {
    /**
     * This is to check each recipient if it's a valid cellphone number
     */

    let isValid = true;
    recipients.forEach(recipient => {
      if (!isValidRecipient(recipient)) {
        isValid = false;
        return isValid;
      }
    });

    return isValid;
  }

  const handleAnnouncementChange = e => {
    if (e.target.value.length <= MAX_CHARACTER_COUNT) {
      setIsAnnouncementError(false);
      setAnnouncement(e.target.value);
    }
  };

  const handleRecipientsChange = e => {
    const recipients = e.target.value;

    setRecipients(recipients);
    if (recipients === '') {
      setIsRecipientError(true);
      return;
    } else setIsRecipientError(false);

    const recipientsSplitByComma = recipients.split(',');

    const trimmed = recipientsSplitByComma.map(recipient => recipient.trim());

    // This is to remove the duplicate numbers so the SMS credit won't be wasted.
    const recipientsWithNoDuplicates = [...new Set(trimmed)];

    if (isValidRecipients(recipientsWithNoDuplicates)) {
      setRecipients(recipientsWithNoDuplicates);
      setIsInvalidRecipients(false);
      if (recipientsWithNoDuplicates.length <= MAX_NUMBER_OF_RECIPIENTS) {
        setIsInvalidNumberOfRecipients(false);
      } else {
        setIsInvalidNumberOfRecipients(true);
      }
    } else {
      setIsInvalidRecipients(true);
    }
  };

  const handleBlurOnAnnouncement = () => {
    if (announcement === '') setIsAnnouncementError(true);
  };

  const handleOnBlurInRecipients = () => {
    if (recipients === '') setIsRecipientError(true);
  };

  const handleSubmit = event => {
    event.preventDefault();

    try {
      setIsLoading(true);
      sendSMS(announcement, recipients);
      setAnnouncement('');
      setRecipients('');

      setTimeout(() => {
        setIsLoading(false);
        toast({
          title: 'Announcement successfully sent!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      }, 1000);
    } catch (error) {
      toast({
        title: 'Something went wrong.',
        description: 'Please contact your support system.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      throw new Error(error);
    }
  };

  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Grid p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Container>
            <Heading>Text Blaster POC: </Heading>
            <br />
            <form onSubmit={handleSubmit}>
              <FormControl isInvalid={isAnnouncementError}>
                <FormLabel>Message:</FormLabel>
                <Textarea
                  id="announcement"
                  value={announcement}
                  placeholder="Enter announcement here"
                  onChange={handleAnnouncementChange}
                  onBlur={handleBlurOnAnnouncement}
                />

                {isAnnouncementError ? (
                  <FormErrorMessage>
                    Entering Message is required
                  </FormErrorMessage>
                ) : (
                  <Text
                    fontSize="sm"
                    ml={1}
                    color={announcement.length === 160 ? '#FB8C00' : null}
                  >
                    Maximum character count: {announcement.length}/160
                  </Text>
                )}

                <br />
                <br />
              </FormControl>

              <FormControl
                isInvalid={
                  isRecipientError ||
                  isInvalidRecipients ||
                  isInvalidNumberOfRecipients
                }
              >
                <FormLabel>Recepient(s):</FormLabel>
                <Text fontSize="xs" ml={1}>
                  Send to multiple numbers by separating with a comma.
                </Text>
                <Textarea
                  id="recipients"
                  value={recipients}
                  placeholder="e.g. 09995551234, 09997771234"
                  onChange={handleRecipientsChange}
                  onBlur={handleOnBlurInRecipients}
                />
                {isRecipientError && (
                  <FormErrorMessage>
                    Entering Recipients is required
                  </FormErrorMessage>
                )}

                {!isRecipientError && isInvalidRecipients && (
                  <FormErrorMessage>Invalid contact numbers.</FormErrorMessage>
                )}

                {isInvalidNumberOfRecipients && (
                  <FormErrorMessage>
                    Max number of recipients only up to{' '}
                    {MAX_NUMBER_OF_RECIPIENTS}.
                  </FormErrorMessage>
                )}
              </FormControl>

              <br />

              <Button
                mt={4}
                colorScheme="blue"
                type="submit"
                rightIcon={<MdSend />}
                isLoading={isLoading}
                loadingText="Sending announcement..."
                disabled={
                  isInvalidRecipients ||
                  isInvalidNumberOfRecipients ||
                  announcement === '' ||
                  recipients === ''
                }
              >
                Send Announcement
              </Button>
            </form>
          </Container>
        </Grid>
      </Box>
    </ChakraProvider>
  );
}

export default App;
