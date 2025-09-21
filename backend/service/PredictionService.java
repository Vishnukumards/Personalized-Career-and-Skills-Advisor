private final RestTemplate restTemplate = new RestTemplate();
private final String pythonServiceUrl = "http://localhost:5000/predict";

public String getCareerPrediction(String userType) {
    // In a real app, these would come from the user's assessment data
    Map<String, String> requestData = new HashMap<>();
    requestData.put("userType", userType);
    requestData.put("interest", "building"); 
    requestData.put("skill_interest", "technical");

    // Make the POST request to the Python service
    Map<String, String> response = restTemplate.postForObject(pythonServiceUrl, requestData, Map.class);
    
    return response != null ? response.get("predictedCareerPath") : "Prediction service unavailable";
}