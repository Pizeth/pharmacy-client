import {
    Edit,
    SimpleForm,
    RadioButtonGroupInput,
    Labeled,
    useRecordContext,
  } from "react-admin";
  import { Typography } from "@mui/material";
  import Grid from "@mui/material/Grid"; // <-- Correct import
  
  // Define your choices for radio buttons
  const SCORE_CHOICES = [
    { id: 0, name: "0" },
    { id: 1, name: "1" },
    { id: 2, name: "2" },
  ];
  
  // Custom row component
  const ScoreRow = ({ source, label }: { source: string; label: string }) => (
    <Grid container alignItems="center" spacing={2}>
      {/* Explicitly specify component prop for TypeScript */}
      <Grid item xs={4} component="div">
        <Typography variant="body1">{label}</Typography>
      </Grid>
      <Grid item xs={8} component="div">
        <RadioButtonGroupInput
          source={source}
          choices={SCORE_CHOICES}
          optionText="name"
          optionValue="id"
          sx={{ display: "flex", gap: 2 }}
          options={{ row: true }}
        />
      </Grid>
    </Grid>
  );
  
  const FormLayout = () => {
    const record = useRecordContext();
    
    return (
      <SimpleForm>
        {/* Page 1 */}
        <ScoreRow source="timeRecord" label="Time Record" />
        
        {/* Pages 2-10 */}
        {[...Array(9)].map((_, index) => (
          <ScoreRow
            key={`action${index + 1}`}
            source={`action${index + 1}`}
            label={`Action ${index + 1}`}
          />
        ))}
      </SimpleForm>
    );
  };
  
  // Usage in your edit/create component
  const FormEdit = () => (
    <Edit>
      <FormLayout />
    </Edit>
  );
  
  export default FormEdit;